"use client";

import IconButton from "@/components/ui/IconButton";
import { Download, Upload } from "lucide-react";

type Props = {
    title: string;

    found: boolean;

    fileName?: string;

    onDownload?: () => void;

    onUpload?: () => void;
};

export function ResourceCard({
    title,
    found,
    fileName,
    onDownload,
    onUpload,
}: Props) {
    return (
        <div
            style={{
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                padding: 16,
                background: "#FFF",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minHeight: 160,
            }}
        >
            <div
                style={{
                    fontWeight: 700,
                    fontSize: 16,
                }}
            >
                {title}
            </div>

            <div>
                <span
                    style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        background: found
                            ? "#DCFCE7"
                            : "#FEE2E2",
                        color: found
                            ? "#15803D"
                            : "#B91C1C",
                    }}
                >
                    {found ? "FOUND" : "MISSING"}
                </span>
            </div>

            <div
                style={{
                    color: "#6B7280",
                    minHeight: 20,
                    fontSize: 12,
                    lineHeight: "18px",
                    wordBreak: "break-all",
                }}
            >
                {fileName ?? "-"}
            </div>

            <div
                style={{
                    borderTop: "1px solid #F1F5F9",
                    marginTop: "auto",
                    paddingTop: 12,
                }}
            />

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "auto",
                }}
            >
                <IconButton
                    title="Download"
                    icon={<Download size={18} />}
                    onClick={onDownload}
                />

                <IconButton
                    title="Upload"
                    icon={<Upload size={18} />}
                    onClick={onUpload}
                />
            </div>
        </div>
    );
}