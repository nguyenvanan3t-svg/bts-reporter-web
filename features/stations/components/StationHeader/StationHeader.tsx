import Link from "next/link";

type StationHeaderProps = {
    stationCode: string;
    projectId: string;
    projectName: string;
    province?: string;
    status: string;
};

export default function StationHeader({
    stationCode,
    projectId,
    projectName,
    province,
    status,
}: StationHeaderProps) {
    const isCompleted = status === "COMPLETED";

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                marginBottom: 12,
                minHeight: 116,
                padding: "9px 16px 10px",
                border: "1px solid #cfe0ff",
                borderRadius: 16,
                background:
                    "linear-gradient(135deg, #f1f7ff 0%, #f8fbff 48%, #e7f0ff 100%)",
                boxSizing: "border-box",
            }}
        >
            {/* Decorative background: giữ hoàn toàn độc lập với nội dung/logic */}
            <div
                aria-hidden="true"
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    pointerEvents: "none",
                }}
            >
                {/* Large right-side soft circle */}
                <div
                    style={{
                        position: "absolute",
                        width: 250,
                        height: 250,
                        right: -78,
                        top: -172,
                        borderRadius: "50%",
                        background: "rgba(191, 219, 254, 0.30)",
                    }}
                />

                {/* Large outer ring */}
                <div
                    style={{
                        position: "absolute",
                        width: 220,
                        height: 220,
                        right: -24,
                        top: -148,
                        borderRadius: "50%",
                        border: "28px solid rgba(147, 197, 253, 0.20)",
                        boxSizing: "border-box",
                    }}
                />

                {/* Middle ring */}
                <div
                    style={{
                        position: "absolute",
                        width: 160,
                        height: 160,
                        right: 18,
                        top: -98,
                        borderRadius: "50%",
                        border: "20px solid rgba(219, 234, 254, 0.78)",
                        boxSizing: "border-box",
                    }}
                />

                {/* Lower overlapping arc */}
                <div
                    style={{
                        position: "absolute",
                        width: 160,
                        height: 160,
                        right: 120,
                        bottom: -138,
                        borderRadius: "50%",
                        background: "rgba(219, 234, 254, 0.28)",
                    }}
                />

                {/* Dot pattern */}
                <div
                    style={{
                        position: "absolute",
                        left: "35%",
                        top: 38,
                        width: 72,
                        height: 48,
                        opacity: 0.55,
                        backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.95) 2px, transparent 2.5px)",
                        backgroundSize: "12px 12px",
                    }}
                />

                {/* Floating circles */}
                <div
                    style={{
                        position: "absolute",
                        right: "35%",
                        top: 32,
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "rgba(191, 219, 254, 0.58)",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        right: "34%",
                        top: 10,
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: "rgba(219, 234, 254, 0.95)",
                    }}
                />
            </div>

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 5,
                    fontSize: 10,
                    lineHeight: 1.3,
                    color: "#2563eb",
                }}
            >
                <Link
                    href="/"
                    style={{
                        color: "#2563eb",
                        textDecoration: "none",
                    }}
                >
                    Home
                </Link>

                <span style={{ color: "#64748b" }}>&gt;</span>

                <Link
                    href="/projects"
                    style={{
                        color: "#2563eb",
                        textDecoration: "none",
                    }}
                >
                    Projects
                </Link>

                <span style={{ color: "#64748b" }}>&gt;</span>

                <Link
                    href={`/projects/${projectId}`}
                    style={{
                        color: "#2563eb",
                        textDecoration: "none",
                    }}
                >
                    {projectName}
                </Link>

                <span style={{ color: "#64748b" }}>&gt;</span>

                <span
                    style={{
                        color: "#1e293b",
                        fontWeight: 600,
                    }}
                >
                    {stationCode}
                </span>
            </div>

            <div
                className="station-header-main"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    minWidth: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 9,
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            width: 38,
                            height: 38,
                            flex: "0 0 38px",
                            borderRadius: 9,
                            background: "#2563eb",
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow:
                                "0 4px 10px rgba(37, 99, 235, 0.18)",
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect
                                x="5"
                                y="3"
                                width="14"
                                height="18"
                                rx="2"
                            />
                            <path d="M9 3V2h6v1" />
                            <path d="M9 8h6M9 12h6M9 16h4" />
                        </svg>
                    </div>

                    <div
                        style={{
                            minWidth: 0,
                        }}
                    >
                        <div
                            style={{
                                marginBottom: 2,
                                color: "#475569",
                                fontSize: 11,
                                lineHeight: 1.25,
                            }}
                        >
                            Station Detail
                        </div>

                        <div
                            style={{
                                color: "#0f172a",
                                fontSize: 20,
                                fontWeight: 700,
                                lineHeight: 1.15,
                            }}
                        >
                            {stationCode}
                        </div>

                        <div
                            style={{
                                marginTop: 2,
                                color: "#64748b",
                                fontSize: 11,
                                lineHeight: 1.3,
                            }}
                        >
                            {projectName}
                            {province ? ` · ${province}` : ""}
                        </div>
                    </div>
                </div>

                <div
                    className="station-header-actions"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flex: "0 0 auto",
                    }}
                >
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "5px 10px",
                            borderRadius: 999,
                            background: isCompleted
                                ? "#dcfce7"
                                : "#dbeafe",
                            color: isCompleted
                                ? "#15803d"
                                : "#1d4ed8",
                            fontSize: 11,
                            fontWeight: 700,
                            lineHeight: 1.2,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <span
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: isCompleted
                                    ? "#16a34a"
                                    : "#2563eb",
                            }}
                        />
                        {isCompleted ? "COMPLETE" : "PENDING"}
                    </span>

                    <Link
                        href={`/projects/${projectId}`}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "7px 12px",
                            border: "1px solid #dbeafe",
                            borderRadius: 8,
                            background: "#ffffff",
                            color: "#334155",
                            textDecoration: "none",
                            fontSize: 11,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            boxShadow:
                                "0 1px 2px rgba(15, 23, 42, 0.04)",
                        }}
                    >
                        <span
                            aria-hidden="true"
                            style={{
                                fontSize: 16,
                                lineHeight: 1,
                            }}
                        >
                            ←
                        </span>
                        Back to Project
                    </Link>
                </div>
            </div>
            </div>
        </div>
    );
}