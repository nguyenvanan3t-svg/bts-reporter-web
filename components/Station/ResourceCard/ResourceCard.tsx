"use client";

import IconButton from "@/components/ui/IconButton";
import { Download, Upload } from "lucide-react";

type Props = {
    title: string;
    found: boolean;
    fileName?: string;
    onDownload?: () => void;
    onUpload?: () => void;
    downloadLoading?: boolean;
    uploadLoading?: boolean;
    downloadDisabled?: boolean;
    uploadDisabled?: boolean;
};

export function ResourceCard({
    title,
    found,
    fileName,
    onDownload,
    onUpload,
    downloadLoading = false,
    uploadLoading = false,
    downloadDisabled = false,
    uploadDisabled = false,
}: Props) {
    const displayFileName = fileName
        ? fileName.replace(/_/g, "_\u200B")
        : "-";

    return (
        <div
            style={{
                border: "1px solid #E2E8F0",
                borderRadius: 9,
                padding: "10px 11px",
                background: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                height: 124,
                minWidth: 0,
                boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
            }}
        >
            {/* Title + status cùng một hàng */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    minWidth: 0,
                }}
            >
                <div
                    style={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 700,
                        fontSize: 14,
                        lineHeight: 1.2,
                        color: "#0F172A",
                    }}
                >
                    {title}
                </div>

                <span
                    style={{
                        flexShrink: 0,
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "3px 8px",
                        borderRadius: 999,
                        fontSize: 9.5,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        background: found ? "#DCFCE7" : "#FEE2E2",
                        color: found ? "#15803D" : "#B91C1C",
                    }}
                >
                    {found ? "FOUND" : "MISSING"}
                </span>
            </div>

            <div
                style={{
                    marginTop: 8,
                    color: "#64748B",
                    height: 30,
                    fontSize: 10.5,
                    lineHeight: 1.4,
                    whiteSpace: "normal",
                    wordBreak: "normal",
                    overflowWrap: "break-word",
                    overflow: "hidden",
                }}
            >
                {displayFileName}
            </div>

            <div
                style={{
                    marginTop: "auto",
                    borderTop: "1px solid #F1F5F9",
                    paddingTop: 5,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <IconButton
                        title={downloadLoading ? "Downloading..." : "Download"}
                        icon={<Download size={15} />}
                        onClick={
                            downloadDisabled || downloadLoading
                                ? undefined
                                : onDownload
                        }
                    />

                    <IconButton
                        title={uploadLoading ? "Uploading..." : "Upload"}
                        icon={<Upload size={15} />}
                        onClick={
                            uploadDisabled || uploadLoading
                                ? undefined
                                : onUpload
                        }
                    />
                </div>
            </div>
        </div>
    );
}