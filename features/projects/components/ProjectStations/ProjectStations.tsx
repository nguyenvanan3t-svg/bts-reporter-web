"use client";

import type {
    Station,
    CompareResult,
    ImportPreviewResult,
} from "@/features/stations/types";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { exportStationsExcel } from "@/features/stations/export";

import {
    importStationExcel,
} from "@/features/stations/excel/service";

import {
    importStations,
    loadAllStations,
} from "@/features/stations/service";

import ImportDialog from "@/components/Station/ImportDialog/ImportDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";

import StationList
from "@/components/Station/StationList/StationList";

import type { Project } from "@/features/projects/types";

type Props = {
    project: Project;
    stations: Station[];
};

export default function ProjectStations({
    project,
    stations,
}: Props) {

    const router = useRouter();

    const [removeStationId, setRemoveStationId] =
        useState<string | null>(null);

    const [importOpen, setImportOpen] =
        useState(false);

    const [importing, setImporting] =
        useState(false);

    const [importPreview, setImportPreview] =
        useState<ImportPreviewResult | undefined>(
            undefined,
        );

    const [importCompare, setImportCompare] =
        useState<CompareResult | null>(null);

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

        exportStationsExcel(
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

        <>

            <StationList
                stations={stations}
                onDelete={setRemoveStationId}
                onRefresh={handleRefresh}
                onExport={handleExport}
                onImport={handleOpenImport}
            />

            <ImportDialog
                open={importOpen}
                importing={importing}
                preview={importPreview}
                onImport={handleImport}
                onConfirm={handleImportConfirm}
                onClose={handleImportClose}
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

        </>

    );

}