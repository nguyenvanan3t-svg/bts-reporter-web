"use client";

import type { Station } from "@/features/stations/types";
import type {
    StationFtpScanResult,
} from "@/lib/ftp/types";
import {
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/Button";
import {
    FolderOpen,
    Trash2,
    Filter,
} from "lucide-react";
import Link from "next/link";
import IconButton from "@/components/ui/IconButton";

type ResourceStatusFilter =
    | "FOUND"
    | "MISSING"
    | "UNKNOWN";

type DpnFilter =
    | "FOUND"
    | "MISSING";

type StationStatusFilter =
    | "PENDING"
    | "COMPLETED"
    | "Vi phạm";

type StationColumnFilters = {
    station: string;
    province: string[];
    survey: ResourceStatusFilter[];
    word: ResourceStatusFilter[];
    visio: ResourceStatusFilter[];
    pdf: ResourceStatusFilter[];
    dpn: DpnFilter[];
    status: StationStatusFilter[];
};

type FilterOption = {
    value: string;
    label: string;
};

type Props = {
    stations: Station[];

    ftpResults?: Record<
        string,
        StationFtpScanResult
    >;

    ftpScanned?: boolean;

    ftpScanning?: boolean;

    lastScanAt?: string | null;

    onScanFtp?: () => void;

    onDelete?: (
        stationId: string,
    ) => void;

    onRefresh?: () => void;

    onExport?: () => void;

    onImport?: () => void;
};

type ColumnFilterProps = {
    label: string;
    options: FilterOption[];
    selected: string[];
    onChange: (values: string[]) => void;
    searchable?: boolean;
    searchOnly?: boolean;
};

function ColumnFilter({
    label,
    options,
    selected,
    onChange,
    searchable = false,
    searchOnly = false,
}: ColumnFilterProps) {
    const [open, setOpen] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [popupPosition, setPopupPosition] =
        useState({
            top: 0,
            left: 0,
        });

    const triggerRef =
        useRef<HTMLButtonElement | null>(
            null,
        );

    const popupRef =
        useRef<HTMLDivElement | null>(
            null,
        );

    const visibleOptions =
        useMemo(() => {
            const keyword =
                search.trim().toLowerCase();

            if (
                searchable &&
                !keyword
            ) {
                return options.slice(
                    0,
                    50,
                );
            }

            if (!keyword) {
                return options;
            }

            return options.filter(
                (option) =>
                    option.label
                        .toLowerCase()
                        .includes(keyword),
            );
        }, [
            options,
            search,
            searchable,
        ]);

    useLayoutEffect(() => {
        if (!open) {
            setSearch("");
            return;
        }

        if (searchOnly) {
            setSearch(selected[0] ?? "");
        }

        const updatePosition = () => {
            const trigger =
                triggerRef.current;

            const popup =
                popupRef.current;

            if (!trigger || !popup) {
                return false;
            }

            const anchor =
                trigger.parentElement?.parentElement ??
                trigger;

            const anchorRect =
                anchor.getBoundingClientRect();

            const popupRect =
                popup.getBoundingClientRect();

            const gap = 4;
            const viewportPadding = 8;

            let top =
                anchorRect.bottom + gap;

            if (
                top + popupRect.height >
                window.innerHeight -
                    viewportPadding
            ) {
                top =
                    anchorRect.top -
                    popupRect.height -
                    gap;
            }

            top = Math.max(
                viewportPadding,
                Math.min(
                    top,
                    window.innerHeight -
                        popupRect.height -
                        viewportPadding,
                ),
            );

            let left =
                anchorRect.left;

            if (
                left + popupRect.width >
                window.innerWidth -
                    viewportPadding
            ) {
                left =
                    anchorRect.right -
                    popupRect.width;
            }

            left = Math.max(
                viewportPadding,
                Math.min(
                    left,
                    window.innerWidth -
                        popupRect.width -
                        viewportPadding,
                ),
            );

            setPopupPosition({
                top,
                left,
            });

            return true;
        };

        let frame1 = 0;
        let frame2 = 0;

        frame1 = requestAnimationFrame(() => {
            frame2 = requestAnimationFrame(() => {
                updatePosition();
            });
        });

        window.addEventListener(
            "resize",
            updatePosition,
        );

        window.addEventListener(
            "scroll",
            updatePosition,
            true,
        );

        return () => {
            cancelAnimationFrame(frame1);
            cancelAnimationFrame(frame2);

            window.removeEventListener(
                "resize",
                updatePosition,
            );

            window.removeEventListener(
                "scroll",
                updatePosition,
                true,
            );
        };
    }, [open, searchOnly, selected]);

    useLayoutEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (
            event: PointerEvent,
        ) => {
            const target =
                event.target as Node;

            const trigger =
                triggerRef.current;

            const popup =
                popupRef.current;

            if (
                trigger?.contains(target) ||
                popup?.contains(target)
            ) {
                return;
            }

            setOpen(false);
        };

        document.addEventListener(
            "pointerdown",
            handlePointerDown,
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown,
            );
        };
    }, [open]);

    function toggleValue(
        value: string,
    ) {
        if (selected.includes(value)) {
            onChange(
                selected.filter(
                    (item) =>
                        item !== value,
                ),
            );

            return;
        }

        onChange([
            ...selected,
            value,
        ]);
    }

    function selectAll() {
        onChange(
            options.map(
                (option) =>
                    option.value,
            ),
        );
    }

    function clearAll() {
        onChange([]);
    }

    const allSelected =
        options.length > 0 &&
        selected.length ===
            options.length;

    return (
        <div
            style={{
                position: "relative",
                display: "inline-flex",
            }}
        >
            <button
                ref={triggerRef}
                type="button"
                title={`Filter ${label}`}
                onClick={() => {
                    const trigger =
                        triggerRef.current;

                    if (!trigger) {
                        setOpen(
                            (value) =>
                                !value,
                        );

                        return;
                    }

                    const anchor =
                        trigger.parentElement?.parentElement ??
                        trigger;

                    const anchorRect =
                        anchor.getBoundingClientRect();

                    setPopupPosition({
                        top:
                            anchorRect.bottom + 4,
                        left:
                            anchorRect.left,
                    });

                    setOpen(
                        (value) =>
                            !value,
                    );
                }}
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent:
                        "center",
                    gap: 3,
                    border: 0,
                    background:
                        "transparent",
                    padding: 2,
                    margin: 0,
                    cursor: "pointer",
                    color:
                        selected.length >
                        0
                            ? "#2563EB"
                            : "#64748B",
                }}
            >
                <Filter size={12} />

                {selected.length >
                    0 && (
                    <span
                        style={{
                            fontSize: 9,
                            fontWeight: 700,
                        }}
                    >
                        {selected.length}
                    </span>
                )}
            </button>

            {open &&
                typeof document !== "undefined" &&
                createPortal(
                    <div
                        ref={popupRef}
                        style={{
                            position: "fixed",
                            top: popupPosition.top,
                            left: popupPosition.left,
                            zIndex: 1000,
                            minWidth: 190,
                            maxWidth: 260,
                            padding: 8,
                            border:
                                "1px solid #CBD5E1",
                            borderRadius: 8,
                            background:
                                "#FFFFFF",
                            boxShadow:
                                "0 8px 24px rgba(15, 23, 42, 0.16)",
                            maxHeight:
                                "calc(100vh - 16px)",
                            overflow: "hidden",
                            boxSizing: "border-box",
                        }}
                    >
                        <div
                            style={{
                                marginBottom: 6,
                                fontSize: 12,
                                fontWeight: 700,
                                color: "#0F172A",
                            }}
                        >
                            {label}
                        </div>

                        {searchable && (
                            <input
                                type="text"
                                placeholder={`Search ${label.toLowerCase()}...`}
                                value={search}
                                onChange={(
                                    event,
                                ) => {
                                    const value =
                                        event.target.value;

                                    setSearch(value);

                                    if (searchOnly) {
                                        onChange(
                                            value
                                                ? [value]
                                                : [],
                                        );
                                    }
                                }}
                                style={{
                                    width: "100%",
                                    height: 30,
                                    padding:
                                        "0 8px",
                                    marginBottom: 6,
                                    border:
                                        "1px solid #CBD5E1",
                                    borderRadius: 6,
                                    fontSize: 11,
                                    boxSizing:
                                        "border-box",
                                    outline:
                                        "none",
                                }}
                            />
                        )}

                        {searchOnly ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    onChange([]);
                                }}
                                style={{
                                    width: "100%",
                                    height: 27,
                                    border:
                                        "1px solid #CBD5E1",
                                    borderRadius: 5,
                                    background:
                                        "#FFFFFF",
                                    color:
                                        "#475569",
                                    fontSize: 10,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Clear
                            </button>
                        ) : (
                            <>
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 6,
                                        marginBottom: 6,
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={selectAll}
                                        style={{
                                            flex: 1,
                                            height: 27,
                                            border:
                                                "1px solid #CBD5E1",
                                            borderRadius: 5,
                                            background:
                                                allSelected
                                                    ? "#EFF6FF"
                                                    : "#FFFFFF",
                                            color:
                                                allSelected
                                                    ? "#2563EB"
                                                    : "#475569",
                                            fontSize: 10,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Select All
                                    </button>

                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        style={{
                                            flex: 1,
                                            height: 27,
                                            border:
                                                "1px solid #CBD5E1",
                                            borderRadius: 5,
                                            background:
                                                "#FFFFFF",
                                            color:
                                                "#475569",
                                            fontSize: 10,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div
                                    style={{
                                        maxHeight:
                                            "calc(100vh - 180px)",
                                        overflowY: "auto",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    {visibleOptions.map(
                                        (option) => {
                                            const checked =
                                                selected.includes(
                                                    option.value,
                                                );

                                            return (
                                                <label
                                                    key={
                                                        option.value
                                                    }
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: 7,
                                                        minHeight:
                                                            30,
                                                        padding:
                                                            "0 5px",
                                                        borderRadius:
                                                            5,
                                                        background:
                                                            checked
                                                                ? "#EFF6FF"
                                                                : "#FFFFFF",
                                                        cursor:
                                                            "pointer",
                                                        fontSize:
                                                            11,
                                                        color:
                                                            "#0F172A",
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            checked
                                                        }
                                                        onChange={() =>
                                                            toggleValue(
                                                                option.value,
                                                            )
                                                        }
                                                    />

                                                    <span>
                                                        {
                                                            option.label
                                                        }
                                                    </span>
                                                </label>
                                            );
                                        },
                                    )}

                                    {visibleOptions.length ===
                                        0 && (
                                        <div
                                            style={{
                                                padding:
                                                    "8px 5px",
                                                color:
                                                    "#64748B",
                                                fontSize:
                                                    11,
                                            }}
                                        >
                                            No results
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>,
                    document.body,
                )}
        </div>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {

    let background = "#fef3c7";
    let color = "#92400e";

    if (status === "COMPLETED") {

        background = "#dcfce7";
        color = "#166534";

    }

    if (status === "Vi phạm") {

        background = "#fee2e2";
        color = "#b91c1c";

    }

    if (status === "IN_PROGRESS") {

        background = "#dbeafe";
        color = "#1d4ed8";

    }

    return (

        <span
            style={{
                display: "inline-block",
                padding: "3px 7px",
                borderRadius: 999,
                background,
                color,
                fontSize: 10,
                fontWeight: 600,
                lineHeight: 1.2,
                whiteSpace: "nowrap" as const,
            }}
        >
            {status}
        </span>

    );

}

function ResourceBadge({
    status,
}: {
    status: "FOUND" | "MISSING" | "UNKNOWN";
}) {

    if (status === "FOUND") {

        return (
            <span
                title="Found"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: "#DCFCE7",
                    color: "#15803D",
                    fontSize: 14,
                    fontWeight: 700,
                    lineHeight: 1,
                }}
            >
                ✓
            </span>
        );

    }

    if (status === "MISSING") {

        return (
            <span
                title="Missing"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: "#F1F5F9",
                    color: "#94A3B8",
                    fontSize: 14,
                    fontWeight: 600,
                    lineHeight: 1,
                }}
            >
                -
            </span>
        );

    }

    return (
        <span
            title="Not scanned"
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 999,
                background: "#F1F5F9",
                color: "#94A3B8",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1,
            }}
        >
            ?
        </span>
    );

}

type FilterColumn =
    | "station"
    | "province"
    | "survey"
    | "word"
    | "visio"
    | "pdf"
    | "dpn"
    | "status";

type StationFilterData = {
    surveyStatus: ResourceStatusFilter;
    wordStatus: ResourceStatusFilter;
    visioStatus: ResourceStatusFilter;
    pdfStatus: ResourceStatusFilter;
    dpnStatus: DpnFilter;
    stationStatus: StationStatusFilter;
};

function getStationFilterData(
    station: Station,
    ftpResults: Record<
        string,
        StationFtpScanResult
    >,
): StationFilterData {
    const ftpResult =
        ftpResults[station.code];

    const surveyStatus: ResourceStatusFilter =
        ftpResult?.survey.status ??
        "UNKNOWN";

    const wordStatus: ResourceStatusFilter =
        ftpResult?.word.status ??
        "UNKNOWN";

    const visioStatus: ResourceStatusFilter =
        ftpResult?.visio.status ??
        "UNKNOWN";

    const pdfStatus: ResourceStatusFilter =
        ftpResult?.pdf.status ??
        "UNKNOWN";

    const hasDpn =
        ftpResult?.dpn ??
        station.hasDpn;

    const dpnStatus: DpnFilter =
        hasDpn
            ? "FOUND"
            : "MISSING";

    const stationStatus: StationStatusFilter =
        ftpResult?.status ??
        (
            ftpResult?.pdf.status ===
            "FOUND"
                ? "COMPLETED"
                : "PENDING"
        );

    return {
        surveyStatus,
        wordStatus,
        visioStatus,
        pdfStatus,
        dpnStatus,
        stationStatus,
    };
}

function matchesStationFilters(
    station: Station,
    ftpResults: Record<
        string,
        StationFtpScanResult
    >,
    search: string,
    columnFilters: StationColumnFilters,
    excludedColumn?: FilterColumn,
): boolean {
    const keyword =
        search.trim().toLowerCase();

    const {
        surveyStatus,
        wordStatus,
        visioStatus,
        pdfStatus,
        dpnStatus,
        stationStatus,
    } =
        getStationFilterData(
            station,
            ftpResults,
        );

    const matchesSearch =
        !keyword ||
        station.code
            .toLowerCase()
            .includes(keyword) ||
        station.province
            .toLowerCase()
            .includes(keyword) ||
        station.address
            .toLowerCase()
            .includes(keyword);

    const matchesStation =
        excludedColumn === "station" ||
        !columnFilters.station ||
        station.code
            .toLowerCase()
            .includes(
                columnFilters.station
                    .trim()
                    .toLowerCase(),
            );

    const matchesProvince =
        excludedColumn === "province" ||
        columnFilters.province.length === 0 ||
        columnFilters.province.includes(
            station.province,
        );

    const matchesSurvey =
        excludedColumn === "survey" ||
        columnFilters.survey.length === 0 ||
        columnFilters.survey.includes(
            surveyStatus,
        );

    const matchesWord =
        excludedColumn === "word" ||
        columnFilters.word.length === 0 ||
        columnFilters.word.includes(
            wordStatus,
        );

    const matchesVisio =
        excludedColumn === "visio" ||
        columnFilters.visio.length === 0 ||
        columnFilters.visio.includes(
            visioStatus,
        );

    const matchesPdf =
        excludedColumn === "pdf" ||
        columnFilters.pdf.length === 0 ||
        columnFilters.pdf.includes(
            pdfStatus,
        );

    const matchesDpn =
        excludedColumn === "dpn" ||
        columnFilters.dpn.length === 0 ||
        columnFilters.dpn.includes(
            dpnStatus,
        );

    const matchesStatus =
        excludedColumn === "status" ||
        columnFilters.status.length === 0 ||
        columnFilters.status.includes(
            stationStatus,
        );

    return (
        matchesSearch &&
        matchesStation &&
        matchesProvince &&
        matchesSurvey &&
        matchesWord &&
        matchesVisio &&
        matchesPdf &&
        matchesDpn &&
        matchesStatus
    );
}

export default function StationList({
    stations,
    ftpResults = {},
    ftpScanned = false,
    ftpScanning = false,
    lastScanAt = null,
    onScanFtp,
    onDelete,
    onRefresh,
    onExport,
    onImport,
}: Props) {
    const [search, setSearch] = useState("");
    const [columnFilters, setColumnFilters] =
        useState<StationColumnFilters>({
            station: "",
            province: [],
            survey: [],
            word: [],
            visio: [],
            pdf: [],
            dpn: [],
            status: [],
        });

    function clearAllFilters() {
        setSearch("");

        setColumnFilters({
            station: "",
            province: [],
            survey: [],
            word: [],
            visio: [],
            pdf: [],
            dpn: [],
            status: [],
        });
    }

    const hasActiveFilters =
        search.trim() !== "" ||
        columnFilters.station !== "" ||
        columnFilters.province.length > 0 ||
        columnFilters.survey.length > 0 ||
        columnFilters.word.length > 0 ||
        columnFilters.visio.length > 0 ||
        columnFilters.pdf.length > 0 ||
        columnFilters.dpn.length > 0 ||
        columnFilters.status.length > 0;

    const resourceFilterOptions:
        FilterOption[] = [
            {
                value: "FOUND",
                label: "Found",
            },
            {
                value: "MISSING",
                label: "Missing",
            },
            {
                value: "UNKNOWN",
                label: "Not scanned",
            },
        ];

    const dpnFilterOptions:
        FilterOption[] = [
            {
                value: "FOUND",
                label: "Có",
            },
            {
                value: "MISSING",
                label: "Không",
            },
        ];

    const statusFilterOptions:
        FilterOption[] = [
            {
                value: "PENDING",
                label: "Pending",
            },
            {
                value: "COMPLETED",
                label: "Complete",
            },
            {
                value: "Vi phạm",
                label: "Vi phạm",
            },
        ];

    function updateColumnFilter<
        K extends keyof StationColumnFilters,
    >(
        key: K,
        values: StationColumnFilters[K],
    ) {
        setColumnFilters(
            (current) => ({
                ...current,
                [key]: values,
            }),
        );
    }

    const filterOptions =
        useMemo(() => {
            const getAvailableStations =
                (
                    excludedColumn: FilterColumn,
                ) =>
                    stations.filter(
                        (station) =>
                            matchesStationFilters(
                                station,
                                ftpResults,
                                search,
                                columnFilters,
                                excludedColumn,
                            ),
                    );

            const provinceStations =
                getAvailableStations(
                    "province",
                );

            const surveyStations =
                getAvailableStations(
                    "survey",
                );

            const wordStations =
                getAvailableStations(
                    "word",
                );

            const visioStations =
                getAvailableStations(
                    "visio",
                );

            const pdfStations =
                getAvailableStations(
                    "pdf",
                );

            const dpnStations =
                getAvailableStations(
                    "dpn",
                );

            const statusStations =
                getAvailableStations(
                    "status",
                );

            const provinceValues =
                Array.from(
                    new Set(
                        provinceStations
                            .map(
                                (station) =>
                                    station.province,
                            )
                            .filter(Boolean),
                    ),
                ).sort((a, b) =>
                    a.localeCompare(
                        b,
                        "vi",
                    ),
                );

            const buildResourceOptions =
                (
                    availableStations: Station[],
                    resource:
                        | "survey"
                        | "word"
                        | "visio"
                        | "pdf",
                ): FilterOption[] => {
                    const availableStatuses =
                        new Set(
                            availableStations.map(
                                (station) =>
                                    getStationFilterData(
                                        station,
                                        ftpResults,
                                    )[
                                        `${resource}Status`
                                    ],
                            ),
                        );

                    return resourceFilterOptions.filter(
                        (option) =>
                            availableStatuses.has(
                                option.value as ResourceStatusFilter,
                            ),
                    );
                };

            const buildDpnOptions =
                (
                    availableStations: Station[],
                ): FilterOption[] => {
                    const availableStatuses =
                        new Set(
                            availableStations.map(
                                (station) =>
                                    getStationFilterData(
                                        station,
                                        ftpResults,
                                    ).dpnStatus,
                            ),
                        );

                    return dpnFilterOptions.filter(
                        (option) =>
                            availableStatuses.has(
                                option.value as DpnFilter,
                            ),
                    );
                };

            const buildStatusOptions =
                (
                    availableStations: Station[],
                ): FilterOption[] => {
                    const availableStatuses =
                        new Set(
                            availableStations.map(
                                (station) =>
                                    getStationFilterData(
                                        station,
                                        ftpResults,
                                    ).stationStatus,
                            ),
                        );

                    return statusFilterOptions.filter(
                        (option) =>
                            availableStatuses.has(
                                option.value as StationStatusFilter,
                            ),
                    );
                };

            return {
                province:
                    provinceValues.map(
                        (province) => ({
                            value: province,
                            label: province,
                        }),
                    ),

                survey:
                    buildResourceOptions(
                        surveyStations,
                        "survey",
                    ),

                word:
                    buildResourceOptions(
                        wordStations,
                        "word",
                    ),

                visio:
                    buildResourceOptions(
                        visioStations,
                        "visio",
                    ),

                pdf:
                    buildResourceOptions(
                        pdfStations,
                        "pdf",
                    ),

                dpn:
                    buildDpnOptions(
                        dpnStations,
                    ),

                status:
                    buildStatusOptions(
                        statusStations,
                    ),
            };
        }, [
            stations,
            search,
            columnFilters,
            ftpResults,
        ]);

    const provinceOptions =
        filterOptions.province;

    const surveyOptions =
        filterOptions.survey;

    const wordOptions =
        filterOptions.word;

    const visioOptions =
        filterOptions.visio;

    const pdfOptions =
        filterOptions.pdf;

    const dpnOptions =
        filterOptions.dpn;

    const statusOptions =
        filterOptions.status;

    const filteredStations =
        useMemo(() => {
            return stations.filter(
                (station) =>
                    matchesStationFilters(
                        station,
                        ftpResults,
                        search,
                        columnFilters,
                    ),
            );
        }, [
            stations,
            search,
            columnFilters,
            ftpResults,
        ]);

    return (
        <div>
            <div
                className="station-list-header"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 8,
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        flexWrap: "wrap",
                    }}
                >
                    <h3
                        style={{
                            margin: 0,
                            fontSize: 19,
                            fontWeight: 700,
                            color: "#0F172A",
                            lineHeight: 1.2,
                        }}
                    >
                        Stations ({filteredStations.length})
                    </h3>

                    <div
                        className="station-list-actions"
                        style={{
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                        }}
                    >
                        <div
                            style={{
                                transform: "scale(0.9)",
                                transformOrigin: "left center",
                                marginRight: -8,
                            }}
                        >
                            <Button
                                onClick={onImport}
                            >
                                Import
                            </Button>
                        </div>

                        <div
                            style={{
                                transform: "scale(0.9)",
                                transformOrigin: "left center",
                                marginRight: -8,
                            }}
                        >
                            <Button
                                onClick={onExport}
                            >
                                Export
                            </Button>
                        </div>

                        <div
                            style={{
                                transform: "scale(0.9)",
                                transformOrigin: "left center",
                            }}
                        >
                            <Button
                                onClick={onRefresh}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                <div
                    className="station-list-ftp"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#475569",
                            }}
                        >
                            FTP Resources
                        </div>

                        <div
                            style={{
                                marginTop: 1,
                                fontSize: 10,
                                color: "#64748B",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {lastScanAt
                                ? `Last scan: ${new Date(
                                    lastScanAt,
                                ).toLocaleString("en-GB")}`
                                : "Not scanned yet"}
                        </div>
                    </div>

                    <div
                        style={{
                            transform: "scale(0.9)",
                            transformOrigin: "right center",
                            marginLeft: -8,
                        }}
                    >
                        <Button
                            variant="primary"
                            loading={ftpScanning}
                            onClick={onScanFtp}
                        >
                            {ftpScanning
                                ? "Scanning..."
                                : "Scan FTP"}
                        </Button>
                    </div>
                </div>
            </div>

            <div
                className="station-list-filter-bar"
                style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 8,
                }}
            >
                <input
                    className="station-list-search"
                    type="text"
                    placeholder="Search station code or province..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    style={{
                        flex: 1,
                        minWidth: 0,
                        height: 32,
                        padding: "0 10px",
                        border: "1px solid #CBD5E1",
                        borderRadius: 7,
                        fontSize: 13,
                        color: "#0F172A",
                        boxSizing: "border-box",
                        outline: "none",
                    }}
                />

                <button
                    type="button"
                    onClick={clearAllFilters}
                    disabled={!hasActiveFilters}
                    style={{
                        height: 32,
                        padding: "0 14px",
                        border:
                            "1px solid #CBD5E1",
                        borderRadius: 7,
                        background:
                            hasActiveFilters
                                ? "#FFFFFF"
                                : "#F8FAFC",
                        color:
                            hasActiveFilters
                                ? "#475569"
                                : "#94A3B8",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor:
                            hasActiveFilters
                                ? "pointer"
                                : "default",
                        whiteSpace:
                            "nowrap",
                    }}
                >
                    Clear Filters
                </button>
            </div>
            <div
                style={{
                    maxHeight: 460,
                    overflow: "auto",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ ...thStyle, ...columnStyles.index }}>
                                #
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.station,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 4,
                                    }}
                                >
                                    <span>Station</span>

                                    <ColumnFilter
                                        label="Station"
                                        options={[]}
                                        selected={
                                            columnFilters.station
                                                ? [
                                                    columnFilters.station,
                                                ]
                                                : []
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "station",
                                                values[0] ?? "",
                                            )
                                        }
                                        searchable
                                        searchOnly
                                    />
                                </div>
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.province,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 4,
                                    }}
                                >
                                    <span>Province</span>

                                    <ColumnFilter
                                        label="Province"
                                        options={provinceOptions}
                                        selected={
                                            columnFilters.province
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "province",
                                                values,
                                            )
                                        }
                                        searchable
                                    />
                                </div>
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.resource,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span>Survey</span>

                                    <ColumnFilter
                                        label="Survey"
                                        options={
                                            surveyOptions
                                        }
                                        selected={
                                            columnFilters.survey
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "survey",
                                                values as ResourceStatusFilter[],
                                            )
                                        }
                                    />
                                </div>
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.resource,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span>Word</span>

                                    <ColumnFilter
                                        label="Word"
                                        options={
                                            wordOptions
                                        }
                                        selected={
                                            columnFilters.word
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "word",
                                                values as ResourceStatusFilter[],
                                            )
                                        }
                                    />
                                </div>
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.resource,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span>Visio</span>

                                    <ColumnFilter
                                        label="Visio"
                                        options={
                                            visioOptions
                                        }
                                        selected={
                                            columnFilters.visio
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "visio",
                                                values as ResourceStatusFilter[],
                                            )
                                        }
                                    />
                                </div>
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.resource,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span>PDF</span>

                                    <ColumnFilter
                                        label="PDF"
                                        options={
                                            pdfOptions
                                        }
                                        selected={
                                            columnFilters.pdf
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "pdf",
                                                values as ResourceStatusFilter[],
                                            )
                                        }
                                    />
                                </div>
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.resource,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span>DPN</span>

                                    <ColumnFilter
                                        label="DPN"
                                        options={
                                            dpnOptions
                                        }
                                        selected={
                                            columnFilters.dpn
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "dpn",
                                                values as DpnFilter[],
                                            )
                                        }
                                    />
                                </div>
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    ...columnStyles.status,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 4,
                                    }}
                                >
                                    <span>Status</span>

                                    <ColumnFilter
                                        label="Status"
                                        options={
                                            statusOptions
                                        }
                                        selected={
                                            columnFilters.status
                                        }
                                        onChange={(values) =>
                                            updateColumnFilter(
                                                "status",
                                                values as StationStatusFilter[],
                                            )
                                        }
                                    />
                                </div>
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.action }}>
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStations.map((station, index) => {
                            const hasDpn =
                                ftpResults[station.code]?.dpn ??
                                station.hasDpn;

                            return (
                                <tr key={station.id}>
                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.index,
                                        }}
                                    >
                                        {index + 1}
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.station,
                                        }}
                                    >
                                        {station.code}
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.province,
                                        }}
                                    >
                                        {station.province}
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.resource,
                                        }}
                                    >
                                        <ResourceBadge
                                            status={
                                                ftpResults[station.code]
                                                    ?.survey.status ??
                                                "UNKNOWN"
                                            }
                                        />
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.resource,
                                        }}
                                    >
                                        <ResourceBadge
                                            status={
                                                ftpResults[station.code]
                                                    ?.word.status ??
                                                "UNKNOWN"
                                            }
                                        />
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.resource,
                                        }}
                                    >
                                        <ResourceBadge
                                            status={
                                                ftpResults[station.code]
                                                    ?.visio.status ??
                                                "UNKNOWN"
                                            }
                                        />
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.resource,
                                        }}
                                    >
                                        <ResourceBadge
                                            status={
                                                ftpResults[station.code]
                                                    ?.pdf.status ??
                                                "UNKNOWN"
                                            }
                                        />
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.resource,
                                        }}
                                    >
                                        <span
                                            title={
                                                hasDpn
                                                    ? "Có Logfile đo phơi nhiễm"
                                                    : "Không có Logfile đo phơi nhiễm"
                                            }
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: 22,
                                                height: 22,
                                                borderRadius: 999,
                                                background: hasDpn
                                                    ? "#DCFCE7"
                                                    : "#F1F5F9",
                                                color: hasDpn
                                                    ? "#15803D"
                                                    : "#94A3B8",
                                                fontSize: 14,
                                                fontWeight: hasDpn
                                                    ? 700
                                                    : 600,
                                                lineHeight: 1,
                                            }}
                                        >
                                            {hasDpn ? "✓" : "-"}
                                        </span>
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.status,
                                        }}
                                    >
                                        <StatusBadge
                                            status={
                                                ftpResults[station.code]?.status ??
                                                (
                                                    ftpResults[station.code]?.pdf.status ===
                                                    "FOUND"
                                                        ? "COMPLETED"
                                                        : "PENDING"
                                                )
                                            }
                                        />
                                    </td>

                                    <td
                                        style={{
                                            ...tdStyle,
                                            ...columnStyles.action,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: 4,
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Link
                                                href={`/stations/${station.id}`}
                                            >
                                                <IconButton
                                                    title="Station Detail"
                                                    icon={
                                                        <FolderOpen
                                                            size={16}
                                                            color="#2563eb"
                                                        />
                                                    }
                                                />
                                            </Link>

                                            <IconButton
                                                title="Remove Station"
                                                icon={
                                                    <Trash2
                                                        size={16}
                                                        color="#dc2626"
                                                    />
                                                }
                                                onClick={() =>
                                                    onDelete?.(station.id)
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    border: "1px solid #e2e8f0",
    padding: "6px 7px",
    background: "#f8fafc",
    textAlign: "left" as const,
    position: "sticky" as const,
    top: 0,
    zIndex: 2,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
    color: "#0f172a",
};

const tdStyle = {
    border: "1px solid #e2e8f0",
    padding: "5px 7px",
    fontSize: 12,
    whiteSpace: "nowrap" as const,
    verticalAlign: "middle" as const,
    color: "#0f172a",
};

const columnStyles = {
    index: {
        width: 40,
        textAlign: "center" as const,
    },

    station: {
        width: 110,
    },

    province: {
        width: 115,
    },

    resource: {
        width: 82,
        textAlign: "center" as const,
    },

    status: {
        width: 105,
        textAlign: "center" as const,
    },

    action: {
        width: 70,
        textAlign: "center" as const,
    },
};