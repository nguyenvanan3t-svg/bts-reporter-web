"use client";

import type { Station } from "@/features/stations/types";
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
                padding: "4px 10px",
                borderRadius: 999,
                background,
                color,
                fontSize: 12,
                fontWeight: 600,
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
                padding: "3px 8px",
                borderRadius: 999,
                background,
                color,
                fontSize: 11,
                fontWeight: 600,
            }}
        >
            {text}
        </span>

    );

}

export default function StationList({
    stations,
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
                    marginBottom: 12,
                }}
            >
                <div>

                    <h3
                        style={{
                            margin: 0,
                            fontSize: 22,
                            fontWeight: 700,
                        }}
                    >
                        Stations ({filteredStations.length})
                    </h3>

                    <div
                        style={{
                            display: "flex",
                            gap: 10,
                            marginTop: 8,
                        }}
                    >

                        <Button
                            onClick={onImport}
                        >
                            Import
                        </Button>

                        <Button
                            onClick={onExport}
                        >
                            Export
                        </Button>

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
                    marginBottom: 12,
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
                        padding: "8px 10px",
                        border: "1px solid #d1d5db",
                        borderRadius: 6,
                    }}
                />
            </div>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Station</th>
                        <th style={thStyle}>Province</th>
                        <th style={thStyle}>Survey</th>
                        <th style={thStyle}>Word</th>
                        <th style={thStyle}>Visio</th>
                        <th style={thStyle}>PDF</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredStations.map((station, index) => (
                        <tr key={station.id}>
                            <td style={tdStyle}>
                                {index + 1}
                            </td>

                            <td style={tdStyle}>
                                {station.code}
                            </td>

                            <td style={tdStyle}>
                                {station.province}
                            </td>

                            <td style={tdStyle}>
                                <ResourceBadge status="UNKNOWN" />
                            </td>

                            <td style={tdStyle}>
                                <ResourceBadge status="UNKNOWN" />
                            </td>

                            <td style={tdStyle}>
                                <ResourceBadge status="UNKNOWN" />
                            </td>

                            <td style={tdStyle}>
                                <ResourceBadge status="UNKNOWN" />
                            </td>

                            <td style={tdStyle}>

                                <StatusBadge
                                    status={station.status}
                                />

                            </td>

                            <td style={tdStyle}>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: 4,
                                        alignItems: "center",
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
    );
}

const thStyle = {
    border: "1px solid #ddd",
    padding: 8,
    background: "#f5f5f5",
    textAlign: "left" as const,
};

const tdStyle = {
    border: "1px solid #ddd",
    padding: 8,
};