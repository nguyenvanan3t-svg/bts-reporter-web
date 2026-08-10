"use client";
import { useRef } from "react";
import { Button } from "@/components/Button";
import { ImportPreview } from "@/components/Station";
import type {
    ImportPreviewResult,
} from "@/features/stations/types";

interface Props {
    open: boolean;

    importing?: boolean;

    preview?: ImportPreviewResult;

    fileName?: string;

    onConfirm: () => void;

    onClose: () => void;

    onImport: (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => void;
}

function SummaryCard({
    label,
    value,
    color = "#2563eb",
}: {
    label: string;

    value: number;

    color?: string;
}) {
    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 12,
                textAlign: "center",
            }}
        >
            <div
                style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color,
                }}
            >
                {value}
            </div>

            <div
                style={{
                    fontSize: 13,
                    color: "#666",
                    marginTop: 4,
                }}
            >
                {label}
            </div>
        </div>
    );
}

export default function ImportDialog({
    open,
    importing = false,
    preview,
    fileName,
    onConfirm,
    onClose,
    onImport,
}: Props) {
    const fileInputRef =
        useRef<HTMLInputElement>(null);
    if (!open) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.35)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}
        >
            <div
                style={{
                    background: "#fff",

                    width: 900,

                    maxWidth: "90vw",

                    height: 650,

                    borderRadius: 8,

                    padding: 24,

                    display: "flex",

                    flexDirection: "column",
                }}
            >
                <h3>Import Station List</h3>

                <p
                    style={{
                        marginTop: 16,
                        marginBottom: 24,
                    }}
                >
                    Select an Excel file containing the station list.
                </p>
                <Button
                    variant="primary"
                    loading={importing}
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                >
                    Choose Excel File
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    hidden
                    onChange={onImport}
                />

                {fileName && (
                    <div
                        style={{
                            marginTop: 12,
                            marginBottom: 16,
                            fontSize: 14,
                        }}
                    >
                        <strong>Selected File:</strong>{" "}
                        {fileName}
                    </div>
                )}

                {preview && (
                    <>
                        <div
                            style={{
                                flex: 1,
                                minHeight: 0,
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                borderRadius: 6,
                                padding: 12,
                                marginTop: 16,
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(5, 1fr)",
                                    gap: 12,
                                    marginBottom: 16,
                                }}
                            >
                                <SummaryCard
                                    label="Total"
                                    value={preview.summary.total}
                                />

                                <SummaryCard
                                    label="Added"
                                    value={preview.summary.added}
                                    color="#16a34a"
                                />

                                <SummaryCard
                                    label="Updated"
                                    value={preview.summary.updated}
                                    color="#f59e0b"
                                />

                                <SummaryCard
                                    label="Removed"
                                    value={preview.summary.removed}
                                    color="#dc2626"
                                />

                                <SummaryCard
                                    label="Unchanged"
                                    value={preview.summary.unchanged}
                                    color="#6b7280"
                                />
                            </div>

                            <ImportPreview
                                stations={preview.stations}
                            />
                        </div>
                    </>
                )}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
                        borderTop: "1px solid #ddd",
                        paddingTop: 16,
                        marginTop: 20,
                    }}
                >
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        disabled={!preview}
                        onClick={onConfirm}
                    >
                        Import
                    </Button>
                </div>
            </div>
        </div>
    );
}