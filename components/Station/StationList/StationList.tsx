"use client";

import type { Station } from "@/features/stations/types";
import type {
    StationFtpScanResult,
} from "@/lib/ftp/types";
import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import {
    FolderOpen,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import IconButton from "@/components/ui/IconButton";

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
    const [statusFilter, setStatusFilter] =
        useState<"ALL" | "PENDING" | "COMPLETED">("ALL");
    const [statusFilterOpen, setStatusFilterOpen] =
        useState(false);
    const filteredStations = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        return stations.filter((station) => {

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

            const stationStatus =
                ftpResults[station.code]?.pdf.status === "FOUND"
                    ? "COMPLETED"
                    : "PENDING";

            const matchesStatus =
                statusFilter === "ALL" ||
                stationStatus === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [stations, search, statusFilter, ftpResults]);
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

                <div className="station-status-filter">

                    {/* Desktop / iPad */}
                    <select
                        className="station-status-filter-native"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(
                                event.target.value as
                                    | "ALL"
                                    | "PENDING"
                                    | "COMPLETED",
                            )
                        }
                        style={{
                            width: "100%",
                            height: 32,
                            padding: "0 8px",
                            border: "1px solid #CBD5E1",
                            borderRadius: 7,
                            background: "#FFFFFF",
                            color: "#0F172A",
                            fontSize: 12,
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Complete</option>
                    </select>

                    {/* iPhone */}
                    <div className="station-status-filter-mobile">

                        <button
                            type="button"
                            onClick={() =>
                                setStatusFilterOpen(
                                    (value) => !value,
                                )
                            }
                            style={{
                                width: "100%",
                                height: 32,
                                padding: "0 10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "1px solid #CBD5E1",
                                borderRadius: 7,
                                background: "#FFFFFF",
                                color: "#0F172A",
                                fontSize: 12,
                                boxSizing: "border-box",
                            }}
                        >
                            <span>
                                {statusFilter === "ALL"
                                    ? "All Status"
                                    : statusFilter === "PENDING"
                                    ? "Pending"
                                    : "Complete"}
                            </span>

                            <span
                                style={{
                                    fontSize: 11,
                                    lineHeight: 1,
                                }}
                            >
                                {statusFilterOpen ? "▲" : "▼"}
                            </span>
                        </button>

                        {statusFilterOpen && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "calc(100% + 4px)",
                                    left: 0,
                                    right: 0,
                                    zIndex: 100,
                                    padding: 4,
                                    border: "1px solid #CBD5E1",
                                    borderRadius: 7,
                                    background: "#FFFFFF",
                                    boxShadow:
                                        "0 4px 12px rgba(15, 23, 42, 0.12)",
                                    boxSizing: "border-box",
                                }}
                            >

                                {[
                                    ["ALL", "All Status"],
                                    ["PENDING", "Pending"],
                                    ["COMPLETED", "Complete"],
                                ].map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => {
                                            setStatusFilter(
                                                value as
                                                    | "ALL"
                                                    | "PENDING"
                                                    | "COMPLETED",
                                            );

                                            setStatusFilterOpen(false);
                                        }}
                                        style={{
                                            width: "100%",
                                            height: 32,
                                            padding: "0 8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent:
                                                "space-between",
                                            border: 0,
                                            borderRadius: 5,
                                            background:
                                                statusFilter === value
                                                    ? "#EFF6FF"
                                                    : "#FFFFFF",
                                            color:
                                                statusFilter === value
                                                    ? "#2563EB"
                                                    : "#0F172A",
                                            fontSize: 12,
                                            fontWeight:
                                                statusFilter === value
                                                    ? 600
                                                    : 400,
                                            textAlign: "left",
                                        }}
                                    >
                                        <span>{label}</span>

                                        {statusFilter === value && (
                                            <span
                                                style={{
                                                    color: "#2563EB",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}

                            </div>
                        )}

                    </div>

                </div>
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

                            <th style={{ ...thStyle, ...columnStyles.station }}>
                                Station
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.province }}>
                                Province
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.resource }}>
                                Survey
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.resource }}>
                                Word
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.resource }}>
                                Visio
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.resource }}>
                                PDF
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.status }}>
                                Status
                            </th>

                            <th style={{ ...thStyle, ...columnStyles.action }}>
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredStations.map((station, index) => (
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
                                        ...columnStyles.status,
                                    }}
                                >
                                    <StatusBadge
                                        status={
                                            ftpResults[station.code]?.pdf.status ===
                                            "FOUND"
                                                ? "COMPLETED"
                                                : "PENDING"
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
                        ))}
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