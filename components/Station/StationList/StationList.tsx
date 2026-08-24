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

    let background = "#E5E7EB";
    let color = "#6B7280";
    let text = "Unknown";

    if (status === "FOUND") {

        background = "#DCFCE7";
        color = "#166534";
        text = "Found";

    }

    if (status === "MISSING") {

        background = "#FEE2E2";
        color = "#991B1B";
        text = "Missing";

    }

    return (

        <span
            style={{
                display: "inline-block",
                padding: "3px 6px",
                borderRadius: 999,
                background,
                color,
                fontSize: 10,
                fontWeight: 600,
                lineHeight: 1.2,
                whiteSpace: "nowrap" as const,
            }}
        >
            {text}
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
    const filteredStations = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();

        if (!keyword) {
            return stations;
        }

        return stations.filter((station) => {

            return (
                station.code
                    .toLowerCase()
                    .includes(keyword) ||

                station.province
                    .toLowerCase()
                    .includes(keyword) ||

                station.address
                    .toLowerCase()
                    .includes(keyword)
            );

        });

    }, [stations, search]);
    return (
        <div>
            <div
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
                style={{
                    marginBottom: 8,
                }}
            >
                <input
                    type="text"
                    placeholder="Search station code or province..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                    style={{
                        width: "100%",
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