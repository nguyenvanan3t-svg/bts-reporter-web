"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Project } from "@/features/projects/types";
import type {
    Station,
    CompareResult,
    ImportPreviewResult,
} from "@/features/stations/types";

import type {
    ProjectFtpScanResult,
    StationFtpScanResult,
} from "@/lib/ftp/types";

import { exportStationsCsv } from "@/features/stations/export";
import {
    importStationExcel,
} from "@/features/stations/excel/service";

import {
    importStations,
    loadAllStations,
} from "@/features/stations/service";

import ImportDialog from "@/components/Station/ImportDialog/ImportDialog";
import ProjectHeader
    from "@/features/projects/components/ProjectHeader";

import ProjectLayout from "@/features/projects/components/ProjectLayout";
import {
    ProjectInformation,
} from "@/features/projects/components/ProjectInformation";

import Card from "@/components/ui/Card";
import StationList from "@/components/Station/StationList/StationList";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import ProjectFtpProgressChart from "./ProjectFtpProgressChart";
import {
    ProvinceProgress,
} from "@/features/projects/components/ProvinceProgress";

type Props = {
    project: Project;
    stations: Station[];
};

function isViolationResource(
    resource: {
        path?: string;
    } | undefined,
): boolean {
    const path =
        resource?.path
            ?.replace(/\\/g, "/")
            .toLowerCase();

    if (!path) {
        return false;
    }

    return path.includes(
        "/ho so/vi pham/",
    );
}

type ProjectFtpScanHistoryItem = {
    id: string;
    startedAt: string;
    completedAt: string | null;
    status:
        | "RUNNING"
        | "COMPLETED"
        | "FAILED";
    totalStations: number;
    surveyFound: number;
    wordFound: number;
    visioFound: number;
    pdfFound: number;
};

export default function ProjectFtpDashboard({
    project,
    stations,
}: Props) {
    const router = useRouter();

    const [scanResults, setScanResults] =
        useState<
            Record<string, StationFtpScanResult>
        >({});

    const [scanning, setScanning] =
        useState(false);

    const [
        removeStationId,
        setRemoveStationId,
    ] = useState<string | null>(null);
    
    const [importOpen, setImportOpen] =
        useState(false);

    const [importing, setImporting] =
        useState(false);

    const [importPreview, setImportPreview] =
        useState<
            ImportPreviewResult | undefined
        >(undefined);

    const [importCompare, setImportCompare] =
        useState<CompareResult | null>(null);

    const [hasScanned, setHasScanned] =
        useState(false);

    const [lastScanAt, setLastScanAt] =
        useState<string | null>(null);

    const [
        scanHistory,
        setScanHistory,
    ] = useState<
        ProjectFtpScanHistoryItem[]
    >([]);

    const loadResources =
        useCallback(async () => {
            try {
                const response = await fetch(
                    `/api/projects/${project.id}/resources`,
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.error ??
                            "Failed to load project FTP resources.",
                    );
                }

                const resources =
                    result.data ?? {};

                if (
                    result.lastScan?.status ===
                    "COMPLETED"
                ) {
                    setLastScanAt(
                        result.lastScan.completedAt ??
                            result.lastScan.startedAt ??
                            null,
                    );
                }

                setScanHistory(
                    result.history ?? [],
                );

                const resultsByStation:
                    Record<
                        string,
                        StationFtpScanResult
                    > = {};

                for (const station of stations) {
                    const resourcesForStation =
                        resources[station.id];

                    if (!resourcesForStation) {
                        continue;
                    }

                    const violation =
                        isViolationResource(
                            resourcesForStation.word,
                        ) ||
                        isViolationResource(
                            resourcesForStation.visio,
                        ) ||
                        isViolationResource(
                            resourcesForStation.pdf,
                        );

                    resultsByStation[
                        station.code
                    ] = {
                        stationCode:
                            station.code,
                        ...resourcesForStation,
                        status:
                            violation
                                ? "Vi phạm"
                                : (
                                    resourcesForStation.pdf?.status ===
                                    "FOUND"
                                        ? "COMPLETED"
                                        : "PENDING"
                                ),
                    };
                }

                setScanResults(
                    resultsByStation,
                );

                setHasScanned(
                    Object.keys(
                        resultsByStation,
                    ).length > 0,
                );
            } catch (error) {
                console.error(
                    "Failed to load project FTP resources:",
                    error,
                );
            }
        }, [project.id, stations]);

    useEffect(() => {
        void loadResources();
    }, [loadResources]);

    const scanSummary = useMemo(() => {
        const results =
            Object.values(scanResults);

        return {
            survey: results.filter(
                (item) =>
                    item.survey.status === "FOUND",
            ).length,

            word: results.filter(
                (item) =>
                    item.word.status === "FOUND",
            ).length,

            visio: results.filter(
                (item) =>
                    item.visio.status === "FOUND",
            ).length,

            pdf: results.filter(
                (item) =>
                    item.pdf.status === "FOUND",
            ).length,
        };
    }, [scanResults]);

    async function handleScanFtp() {
        if (scanning) {
            return;
        }

        try {
            setScanning(true);

            const response = await fetch(
                "/api/ftp/scan",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        projectId:
                            project.id,
                    }),
                },
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error ??
                        "FTP scan failed.",
                );
            }

            const resultsByStation =
                result.data.stations.reduce(
                    (
                        map: Record<
                            string,
                            StationFtpScanResult
                        >,
                        item: StationFtpScanResult,
                    ) => {
                        map[item.stationCode] =
                            item;

                        return map;
                    },
                    {},
                );

            setScanResults(
                resultsByStation,
            );

            setHasScanned(true);

            setLastScanAt(
                new Date().toISOString(),
            );

            await loadResources();

            toast.success(
                `FTP scan completed. ${result.data.stations.length} stations checked.`,
            );
        } catch (error) {
            console.error(
                "FTP scan failed:",
                error,
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "FTP scan failed.",
            );
        } finally {
            setScanning(false);
        }
    }

    async function handleRemoveStation() {
        if (!removeStationId) {
            return;
        }

        try {
            const response = await fetch(
                "/api/stations/remove",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        stationId:
                            removeStationId,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error();
            }

            toast.success(
                "Station removed successfully.",
            );

            setRemoveStationId(null);

            router.refresh();
        } catch {
            toast.error(
                "Failed to remove station.",
            );
        }
    }

    function handleRefresh() {
        router.refresh();
    }

    function handleExport() {
        exportStationsCsv(
            stations,
            `${project.code}_${project.name}_Stations`,
        );

        toast.success(
            "CSV exported successfully.",
        );
    }

    async function handleImport(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setImporting(true);

            const currentStations =
                await loadAllStations(
                    project.id,
                );

            const result =
                await importStationExcel(
                    file,
                    currentStations,
                );

            setImportPreview(
                result.preview,
            );

            setImportCompare(
                result.compare,
            );
        } catch {
            toast.error(
                "Failed to read station file.",
            );

            setImportPreview(
                undefined,
            );

            setImportCompare(
                null,
            );
        } finally {
            setImporting(false);

            event.target.value = "";
        }
    }

    async function handleImportConfirm() {
        if (!importCompare) {
            return;
        }

        try {
            setImporting(true);

            await importStations(
                project.id,
                importCompare,
            );

            toast.success(
                "Stations imported successfully.",
            );

            setImportOpen(false);

            setImportPreview(
                undefined,
            );

            setImportCompare(
                null,
            );

            router.refresh();
        } catch {
            toast.error(
                "Failed to import stations.",
            );
        } finally {
            setImporting(false);
        }
    }

    function handleImportClose() {
        if (importing) {
            return;
        }

        setImportOpen(false);

        setImportPreview(
            undefined,
        );

        setImportCompare(
            null,
        );
    }

    function handleOpenImport() {
        setImportPreview(
            undefined,
        );

        setImportCompare(
            null,
        );

        setImportOpen(true);
    }

    return (
        <div
            style={{
                position: "relative",
            }}
        >
            <ProjectHeader
                project={project}
                survey={
                    hasScanned
                        ? scanSummary.survey
                        : 0
                }
                documents={
                    hasScanned
                        ? scanSummary.pdf
                        : 0
                }
                totalStations={stations.length}
                lastScanAt={lastScanAt}
            />

            <ProjectLayout
                left={
                    <Card>
                        <ProjectInformation
                            code={project.code}
                            name={project.name}
                            customer={
                                project.customer
                            }
                            year={project.year}
                            status={project.status}
                            description={
                                project.description
                            }
                        />
                    </Card>
                }
                center={
                    <div className="space-y-3">
                        <ProvinceProgress
                            stations={stations}
                            ftpResults={scanResults}
                            ftpScanned={hasScanned}
                        />

                        <div
                            style={{
                                marginTop: 12,
                                padding: 12,
                                background: "#FFFFFF",
                                border: "1px solid #E2E8F0",
                                borderRadius: 12,
                                boxShadow:
                                    "0 2px 8px rgba(15, 23, 42, 0.04)",
                            }}
                        >
                            <StationList
                                stations={stations}
                                ftpResults={
                                    scanResults
                                }
                                ftpScanned={
                                    hasScanned
                                }
                                ftpScanning={
                                    scanning
                                }
                                lastScanAt={
                                    lastScanAt
                                }
                                onScanFtp={
                                    handleScanFtp
                                }
                                onRefresh={
                                    handleRefresh
                                }
                                onExport={
                                    handleExport
                                }
                                onImport={
                                    () => setImportOpen(true)
                                }
                                onDelete={
                                    (stationId) =>
                                        setRemoveStationId(
                                            stationId,
                                        )
                                }
                            />
                        </div>
                    </div>
                }
                right={
                    <Card>
                        <div className="p-3">
                            <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                                PROGRESS
                            </h3>

                            <span className="text-[10px] text-muted-foreground">
                                Snapshot
                            </span>
                        </div>

                            {/* Tiến độ hiện tại */}
                            <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-2">
                                {[
                                    {
                                        label: "Survey",
                                        value: scanSummary.survey,
                                        color: "#16a34a",
                                    },
                                    {
                                        label: "Word",
                                        value: scanSummary.word,
                                        color: "#2563eb",
                                    },
                                    {
                                        label: "Visio",
                                        value: scanSummary.visio,
                                        color: "#9333ea",
                                    },
                                    {
                                        label: "PDF",
                                        value: scanSummary.pdf,
                                        color: "#f97316",
                                    },
                                ].map((item) => {
                                    const percentage =
                                        stations.length > 0
                                            ? Math.round(
                                                (item.value /
                                                    stations.length) *
                                                    100,
                                            )
                                            : 0;

                                    return (
                                        <div
                                            key={item.label}
                                        >
                                            <div className="mb-1 flex items-center justify-between text-[10px]">
                                                <span className="font-medium">
                                                    {item.label}
                                                </span>

                                                <span className="text-muted-foreground">
                                                    {item.value}/
                                                    {stations.length}
                                                </span>
                                            </div>

                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor:
                                                            item.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Biểu đồ */}
                            <ProjectFtpProgressChart
                                history={
                                    scanHistory
                                }
                            />

                            {/* Lịch sử tiến độ */}
                            {scanHistory.length > 0 && (
                                <div className="mt-2 border-t border-slate-200 pt-2">
                                    <div className="mb-1.5 text-[11px] font-semibold">
                                        Progress History
                                    </div>

                                    <div className="space-y-1">
                                        <div
                                            className="grid items-center gap-x-1 text-[10px]"
                                            style={{
                                                gridTemplateColumns:
                                                    "72px repeat(4, minmax(0, 1fr))",
                                            }}
                                        >
                                            {/* Header */}
                                            <div className="text-muted-foreground">
                                                Time
                                            </div>

                                            <div className="text-center text-muted-foreground">
                                                Survey
                                            </div>

                                            <div className="text-center text-muted-foreground">
                                                Word
                                            </div>

                                            <div className="text-center text-muted-foreground">
                                                Visio
                                            </div>

                                            <div className="text-center text-muted-foreground">
                                                PDF
                                            </div>

                                            {/* History rows */}
                                            {scanHistory
                                                .slice(0, 5)
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        style={{
                                                            display: "contents",
                                                        }}
                                                    >
                                                        <div className="py-1">
                                                            {new Date(
                                                                item.startedAt,
                                                            ).toLocaleString(
                                                                "vi-VN",
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                    day: "2-digit",
                                                                    month: "2-digit",
                                                                },
                                                            )}
                                                        </div>

                                                        <div className="py-1 text-center">
                                                            {item.surveyFound}/
                                                            {item.totalStations}
                                                        </div>

                                                        <div className="py-1 text-center">
                                                            {item.wordFound}/
                                                            {item.totalStations}
                                                        </div>

                                                        <div className="py-1 text-center">
                                                            {item.visioFound}/
                                                            {item.totalStations}
                                                        </div>

                                                        <div className="py-1 text-center">
                                                            {item.pdfFound}/
                                                            {item.totalStations}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                }
            />

            <ConfirmDialog
                open={
                    removeStationId !== null
                }
                title="Remove Station"
                message="Remove this station from the project? Files on the FTP server will NOT be deleted."
                confirmText="Remove"
                cancelText="Cancel"
                onCancel={() =>
                    setRemoveStationId(null)
                }
                onConfirm={
                    handleRemoveStation
                }
            />

            <ImportDialog
                open={
                    importOpen
                }
                importing={
                    importing
                }
                preview={
                    importPreview
                }
                onImport={
                    handleImport
                }
                onConfirm={
                    handleImportConfirm
                }
                onClose={
                    handleImportClose
                }
            />
        </div>
    );
}