import type { Project } from "../../types";
import Link from "next/link";

interface ProjectHeaderProps {
    project: Project;
    survey: number;
    documents: number;
    totalStations: number;
    lastScanAt: string | null;
}

function formatLastScan(value: string | null) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        },
    );
}

function ProgressCard({
    type,
    label,
    value,
    total,
}: {
    type: "survey" | "documents";
    label: string;
    value: number;
    total: number;
}) {
    const percentage =
        total > 0
            ? Math.round((value / total) * 1000) / 10
            : 0;

    const isSurvey = type === "survey";

    return (
        <div
            style={{
                minWidth: 0,
                height: 72,
                padding: "10px 12px",
                borderRadius: 12,
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow:
                    "0 4px 14px rgba(15, 23, 42, 0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                }}
            >
                <span
                    style={{
                        fontSize: 12,
                        color: "#64748b",
                        fontWeight: 500,
                    }}
                >
                    {label}
                </span>

                <span
                    style={{
                        fontSize: 12,
                        color: "#64748b",
                        whiteSpace: "nowrap",
                    }}
                >
                    {value} / {total}
                </span>
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
                        flex: 1,
                        height: 5,
                        borderRadius: 999,
                        background: "#e2e8f0",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${percentage}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: isSurvey
                                ? "#2563eb"
                                : "#16a34a",
                        }}
                    />
                </div>

                <strong
                    style={{
                        fontSize: 12,
                        color: "#0f172a",
                        minWidth: 38,
                        textAlign: "right",
                    }}
                >
                    {percentage}%
                </strong>
            </div>
        </div>
    );
}

function StatusCard({
    status,
}: {
    status: string;
}) {
    return (
        <div
            style={{
                height: 72,
                padding: "10px 12px",
                borderRadius: 12,
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow:
                    "0 4px 14px rgba(15, 23, 42, 0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <span
                style={{
                    fontSize: 12,
                    color: "#64748b",
                    fontWeight: 500,
                }}
            >
                Status
            </span>

            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    alignSelf: "flex-start",
                    gap: 7,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
                }}
            >
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#2563eb",
                    }}
                />

                {status || "PLANNING"}
            </span>
        </div>
    );
}

export default function ProjectHeader({
    project,
    survey,
    documents,
    totalStations,
    lastScanAt,
}: ProjectHeaderProps) {
    return (
        <header
            style={{
                position: "relative",
                overflow: "hidden",
                marginBottom: 16,
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid #cfe0ff",
                background:
                    "linear-gradient(135deg, #eff6ff 0%, #f8fbff 55%, #e5efff 100%)",
                boxShadow:
                    "0 8px 24px rgba(37, 99, 235, 0.06)",
            }}
        >
            {/* Decorative background */}
            <div
                style={{
                    position: "absolute",
                    width: 260,
                    height: 260,
                    borderRadius: "50%",
                    background:
                        "rgba(147, 197, 253, 0.16)",
                    right: -120,
                    top: -170,
                    pointerEvents: "none",
                }}
            />

            <div
                className="project-header-grid"
                style={{
                    position: "relative",
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(240px, 1.05fr) minmax(0, 2.5fr) auto",
                    alignItems: "center",
                    gap: 14,
                }}
            >
                {/* Project identity */}
                <div
                    style={{
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            marginBottom: 7,
                            fontSize: 12,
                            color: "#2563eb",
                        }}
                    >
                        <Link
                            href="/"
                            className="hover:text-blue-700"
                        >
                            Home
                        </Link>

                        <span>&gt;</span>

                        <Link
                            href="/projects"
                            className="hover:text-blue-700"
                        >
                            Projects
                        </Link>

                        <span>&gt;</span>

                        <span
                            style={{
                                color: "#475569",
                                fontWeight: 600,
                            }}
                        >
                            {project.name}
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                flex: "0 0 auto",
                                borderRadius: 12,
                                background: "#2563eb",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <svg
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="4"
                                    y="3"
                                    width="16"
                                    height="18"
                                    rx="2"
                                />
                                <path d="M8 7h8M8 11h8M8 15h5" />
                            </svg>
                        </div>

                        <div
                            style={{
                                minWidth: 0,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "#475569",
                                    marginBottom: 2,
                                }}
                            >
                                Project Detail
                            </div>

                            <h1
                                style={{
                                    margin: 0,
                                    fontSize: 22,
                                    lineHeight: 1.1,
                                    fontWeight: 700,
                                    color: "#0f172a",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {project.name}
                            </h1>

                            <div
                                style={{
                                    marginTop: 3,
                                    fontSize: 11,
                                    color: "#64748b",
                                }}
                            >
                                Manage and track survey progress,
                                documents, and station status.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div
                    className="project-header-metrics"
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4, minmax(105px, 1fr))",
                        gap: 8,
                        minWidth: 0,
                    }}
                >
                    <ProgressCard
                        type="survey"
                        label="Survey"
                        value={survey}
                        total={totalStations}
                    />

                    <ProgressCard
                        type="documents"
                        label="Documents"
                        value={documents}
                        total={totalStations}
                    />

                    <div
                        style={{
                            height: 72,
                            padding: "10px 12px",
                            borderRadius: 12,
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            boxShadow:
                                "0 4px 14px rgba(15, 23, 42, 0.06)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 12,
                                color: "#64748b",
                                fontWeight: 500,
                            }}
                        >
                            Last scan
                        </span>

                        <strong
                            className="project-header-last-scan"
                            style={{
                                fontSize: 12,
                                color: "#0f172a",
                                lineHeight: 1.35,
                            }}
                        >
                            {formatLastScan(lastScanAt)}
                        </strong>
                    </div>

                    <StatusCard
                        status={project.status}
                    />
                </div>

                {/* Back button */}
                <Link
                    href="/projects"
                    className="project-header-back"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        height: 36,
                        padding: "0 14px",
                        borderRadius: 9,
                        background: "#ffffff",
                        border: "1px solid #dbe3ef",
                        color: "#334155",
                        fontSize: 12,
                        fontWeight: 600,
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                        boxShadow:
                            "0 2px 6px rgba(15, 23, 42, 0.04)",
                    }}
                >
                    <span>←</span>
                    Back to Projects
                </Link>
            </div>
        </header>
    );
}