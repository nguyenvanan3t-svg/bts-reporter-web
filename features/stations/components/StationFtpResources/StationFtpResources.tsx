"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { ResourceCard } from "@/components/Station/ResourceCard";
import {
    ResourceStatusTable,
} from "@/components/Station";

type FtpResource = {
    status: "FOUND" | "MISSING";
    type?: "file" | "folder";
    fileName?: string;
    path?: string;
    size?: number;
    modifiedAt?: string;
};

type FtpResources = {
    survey: FtpResource;
    word: FtpResource;
    visio: FtpResource;
    pdf: FtpResource;
};

type StationFtpResourcesProps = {
    stationId: string;
    projectId: string;
    stationCode: string;
    hasDpn: boolean;
};

function formatFileSize(size?: number) {
    if (size == null) {
        return "-";
    }

    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value?: string) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("vi-VN");
}

export default function StationFtpResources({
    stationId,
    projectId,
    stationCode,
    hasDpn,
}: StationFtpResourcesProps) {
    const [resources, setResources] =
        useState<FtpResources | null>(null);

    const [dpnFound, setDpnFound] =
        useState(hasDpn);

    const [scanning, setScanning] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    const [downloading, setDownloading] =
        useState<string | null>(null);

    const [uploading, setUploading] =
        useState<string | null>(null);

    const [uploadResourceType, setUploadResourceType] =
        useState<
            "survey" |
            "word" |
            "visio" |
            "pdf" |
            null
        >(null);

    const fileInputRef =
        useRef<HTMLInputElement | null>(null);

    const loadResources = useCallback(async () => {
        setError(null);

        try {
            const response = await fetch(
                `/api/stations/${stationId}/resources`,
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error ??
                        "Failed to load station resources.",
                );
            }

            setResources(result.data);
        } catch (err) {
            console.error(
                "Failed to load station resources:",
                err,
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load station resources.",
            );
        }
    }, [stationId]);

    const scanFtp = useCallback(async () => {
        setScanning(true);
        setError(null);

        try {
            const response = await fetch(
                "/api/ftp/scan-station",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        projectId,
                        stationCode,
                    }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.error ??
                        "FTP scan failed.",
                );
            }

            setResources(result.data);
            setDpnFound(
                result.data?.dpn === true,
            );
        } catch (err) {
            console.error(
                "Station FTP scan failed:",
                err,
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "FTP scan failed.",
            );
        } finally {
            setScanning(false);
        }
    }, [projectId, stationCode]);

    useEffect(() => {
        void loadResources();
    }, [loadResources]);

    const getResource = (
        resource: FtpResource | undefined,
    ) => {
        return resource ?? {
            status: "MISSING" as const,
        };
    };

    const survey = getResource(resources?.survey);
    const word = getResource(resources?.word);
    const visio = getResource(resources?.visio);
    const pdf = getResource(resources?.pdf);

    const downloadResource = useCallback(
        async (
            resource:
                | "dpn"
                | "survey"
                | "word"
                | "visio"
                | "pdf",
        ) => {

            setDownloading(resource);
            setError(null);

            try {

                const response = await fetch(
                    "/api/ftp/download",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            projectId,
                            stationCode,
                            resource,
                        }),
                    },
                );

                if (!response.ok) {

                    let message =
                        "FTP download failed.";

                    try {

                        const result =
                            await response.json();

                        message =
                            result?.error ??
                            message;

                    } catch {
                        // Response không phải JSON.
                    }

                    throw new Error(message);
                }

                const blob =
                    await response.blob();

                const contentDisposition =
                    response.headers.get(
                        "Content-Disposition",
                    );

                let fileName =
                    resource === "dpn"
                        ? `${stationCode}.zip`
                        : resource === "survey"
                        ? `${stationCode}.zip`
                        : resource === "word"
                        ? word.fileName ??
                            `${stationCode}.docx`
                        : resource === "visio"
                            ? visio.fileName ??
                            `${stationCode}.vsdx`
                            : pdf.fileName ??
                            `${stationCode}.pdf`;

                const fileNameMatch =
                    contentDisposition?.match(
                        /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i,
                    );

                if (fileNameMatch?.[1]) {

                    fileName =
                        decodeURIComponent(
                            fileNameMatch[1],
                        );
                }

                const url =
                    window.URL.createObjectURL(
                        blob,
                    );

                const anchor =
                    document.createElement("a");

                anchor.href = url;
                anchor.download = fileName;

                document.body.appendChild(anchor);

                anchor.click();

                anchor.remove();

                window.URL.revokeObjectURL(url);

            } catch (err) {

                console.error(
                    "FTP download failed:",
                    err,
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "FTP download failed.",
                );

            } finally {

                setDownloading(null);

            }
        },
        [
            projectId,
            stationCode,
            word.fileName,
            visio.fileName,
            pdf.fileName,
        ],
    );

    const openUploadPicker = useCallback(
        (
            resource:
                | "survey"
                | "word"
                | "visio"
                | "pdf",
        ) => {

            setUploadResourceType(resource);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
                fileInputRef.current.click();
            }
        },
        [],
    );

    const uploadResource = useCallback(
        async (file: File) => {

            if (!uploadResourceType) {
                return;
            }

            const resource =
                uploadResourceType;

            setUploading(resource);
            setError(null);

            try {

                const formData =
                    new FormData();

                formData.append(
                    "projectId",
                    projectId,
                );

                formData.append(
                    "stationCode",
                    stationCode,
                );

                formData.append(
                    "resource",
                    resource,
                );

                formData.append(
                    "file",
                    file,
                );

                const response =
                    await fetch(
                        "/api/ftp/upload",
                        {
                            method: "POST",
                            body: formData,
                        },
                    );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result?.error ??
                            "FTP upload failed.",
                    );
                }

            } catch (err) {

                console.error(
                    "FTP upload failed:",
                    err,
                );

                setError(
                    err instanceof Error
                        ? err.message
                        : "FTP upload failed.",
                );

            } finally {

                setUploading(null);
                setUploadResourceType(null);

            }
        },
        [
            projectId,
            stationCode,
            uploadResourceType,
        ],
    );

    const tableItems = [
        {
            resource: "Survey",
            status: survey.status,
            fileName:
                survey.fileName ?? "-",
            path:
                survey.path ?? "-",
            size: formatFileSize(survey.size),
            updated: formatDate(
                survey.modifiedAt,
            ),
        },
        {
            resource: "Word",
            status: word.status,
            fileName:
                word.fileName ?? "-",
            path:
                word.path ?? "-",
            size: formatFileSize(word.size),
            updated: formatDate(
                word.modifiedAt,
            ),
        },
        {
            resource: "Visio",
            status: visio.status,
            fileName:
                visio.fileName ?? "-",
            path:
                visio.path ?? "-",
            size: formatFileSize(visio.size),
            updated: formatDate(
                visio.modifiedAt,
            ),
        },
        {
            resource: "PDF",
            status: pdf.status,
            fileName:
                pdf.fileName ?? "-",
            path:
                pdf.path ?? "-",
            size: formatFileSize(pdf.size),
            updated: formatDate(
                pdf.modifiedAt,
            ),
        },
    ];

    const handleFileSelected = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        void uploadResource(file);
    };

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                hidden
                accept={
                    uploadResourceType === "survey"
                        ? ".zip"
                        : uploadResourceType === "word"
                        ? ".docx"
                        : uploadResourceType === "visio"
                            ? ".vsdx"
                            : uploadResourceType === "pdf"
                            ? ".pdf"
                            : undefined
                }
                onChange={handleFileSelected}
            />
            <div
                className="station-ftp-resource-header"
                style={{
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "9px 14px",
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderLeft: "4px solid #2563EB",
                    borderRadius: 10,
                    boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 15,
                            lineHeight: 1.2,
                            fontWeight: 700,
                            color: "#0F172A",
                        }}
                    >
                        Resource Monitor
                    </div>

                    <div
                        style={{
                            marginTop: 2,
                            color: "#64748B",
                            fontSize: 10.5,
                            lineHeight: 1.3,
                        }}
                    >
                        Current survey and document resources detected on FTP server.
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => void scanFtp()}
                    disabled={scanning}
                    style={{
                        flexShrink: 0,
                        border: 0,
                        borderRadius: 7,
                        padding: "7px 12px",
                        background: "#2563EB",
                        color: "#FFFFFF",
                        cursor: scanning ? "default" : "pointer",
                        opacity: scanning ? 0.6 : 1,
                        fontWeight: 600,
                        fontSize: 12,
                    }}
                >
                    {scanning ? "Scanning..." : "Scan FTP"}
                </button>
            </div>

            <div
                className="station-ftp-resource-grid"
            >
                <ResourceCard
                    title="Survey"
                    found={
                        survey.status ===
                        "FOUND"
                    }
                    fileName={
                        survey.fileName
                    }
                    onDownload={
                        survey.status === "FOUND"
                            ? () =>
                                void downloadResource(
                                    "survey",
                                )
                            : undefined
                    }
                    onUpload={() =>
                        openUploadPicker("survey")
                    }
                    downloadLoading={
                        downloading === "survey"
                    }
                    uploadLoading={
                        uploading === "survey"
                    }
                    downloadDisabled={
                        survey.status !== "FOUND"
                    }
                    uploadDisabled={
                        survey.status !== "FOUND" ||
                        survey.type === "folder"
                    }
                />

                <ResourceCard
                    title="Word"
                    found={
                        word.status ===
                        "FOUND"
                    }
                    fileName={
                        word.fileName
                    }
                    onDownload={
                        word.status === "FOUND"
                            ? () =>
                                void downloadResource(
                                    "word",
                                )
                            : undefined
                    }
                    onUpload={() =>
                        openUploadPicker("word")
                    }
                    downloadLoading={
                        downloading === "word"
                    }
                    uploadLoading={
                        uploading === "word"
                    }
                    downloadDisabled={
                        word.status !== "FOUND"
                    }
                    uploadDisabled={
                        word.status !== "FOUND"
                    }
                />

                <ResourceCard
                    title="Visio"
                    found={
                        visio.status ===
                        "FOUND"
                    }
                    fileName={
                        visio.fileName
                    }
                    onDownload={
                        visio.status === "FOUND"
                            ? () =>
                                void downloadResource(
                                    "visio",
                                )
                            : undefined
                    }
                    onUpload={() =>
                        openUploadPicker("visio")
                    }
                    downloadLoading={
                        downloading === "visio"
                    }
                    uploadLoading={
                        uploading === "visio"
                    }
                    downloadDisabled={
                        visio.status !== "FOUND"
                    }
                    uploadDisabled={
                        visio.status !== "FOUND"
                    }
                />

                <ResourceCard
                    title="PDF"
                    found={
                        pdf.status ===
                        "FOUND"
                    }
                    fileName={
                        pdf.fileName
                    }
                    onDownload={
                        pdf.status === "FOUND"
                            ? () =>
                                void downloadResource(
                                    "pdf",
                                )
                            : undefined
                    }
                    onUpload={() =>
                        openUploadPicker("pdf")
                    }
                    downloadLoading={
                        downloading === "pdf"
                    }
                    uploadLoading={
                        uploading === "pdf"
                    }
                    downloadDisabled={
                        pdf.status !== "FOUND"
                    }
                    uploadDisabled={
                        pdf.status !== "FOUND"
                    }
                />
            </div>

            <div
                style={{
                    height: 16,
                }}
            />

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 14px",
                    background: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: 8,
                }}
            >
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#334155",
                    }}
                >
                    Logfile đo phơi nhiễm
                </div>

                <button
                    type="button"
                    onClick={() =>
                        void downloadResource("dpn")
                    }
                    disabled={
                        !dpnFound ||
                        downloading === "dpn"
                    }
                    style={{
                        flexShrink: 0,
                        border: 0,
                        borderRadius: 7,
                        padding: "7px 12px",
                        background:
                            dpnFound
                                ? "#2563EB"
                                : "#CBD5E1",
                        color: "#FFFFFF",
                        cursor:
                            dpnFound &&
                            downloading !== "dpn"
                                ? "pointer"
                                : "default",
                        opacity:
                            downloading === "dpn"
                                ? 0.6
                                : 1,
                        fontWeight: 600,
                        fontSize: 12,
                    }}
                >
                    {downloading === "dpn"
                        ? "Đang tải..."
                        : "Tải về"}
                </button>
            </div>

            <div
                style={{
                    height: 16,
                }}
            />

            <ResourceStatusTable
                items={tableItems}
            />
        </>
    );
}