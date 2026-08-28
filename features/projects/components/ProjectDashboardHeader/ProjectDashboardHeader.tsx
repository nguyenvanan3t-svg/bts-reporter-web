"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
    totalProjects: number;
    lastScan: string | null;
};

function formatLastScan(value: string | null) {
    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

export default function ProjectDashboardHeader({
    totalProjects,
    lastScan,
}: Props) {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        const supabase = createClient();

        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setEmail(user?.email ?? "");
        }

        loadUser();
    }, []);

    async function handleLogout() {
        setLoggingOut(true);

        const supabase = createClient();

        await supabase.auth.signOut();

        router.push("/");
        router.refresh();
    }

    return (
        <section
            style={{
                position: "relative",
                overflow: "hidden",
                marginBottom: 14,
                padding: "12px 20px",
                border: "1px solid #DCE8F7",
                borderRadius: 16,
                background:
                    "linear-gradient(135deg, #EFF6FF 0%, #EAF3FF 55%, #F8FBFF 100%)",
                boxShadow: "0 6px 20px rgba(37,99,235,.06)",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: 280,
                    height: 280,
                    right: -80,
                    top: -150,
                    borderRadius: "50%",
                    background: "rgba(147,197,253,.18)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    width: 220,
                    height: 220,
                    right: 220,
                    bottom: -170,
                    borderRadius: "50%",
                    background: "rgba(191,219,254,.22)",
                }}
            />

            <div
                className="project-dashboard-header-main"
                style={{
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <div
                    style={{
                        minWidth: 0,
                        maxWidth: 520,
                        paddingTop: 2,
                    }}
                >
                    <div
                        style={{
                            fontSize: 23,
                            fontWeight: 750,
                            lineHeight: 1.1,
                            color: "#102A56",
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Project Dashboard
                    </div>

                    <div
                        style={{
                            marginTop: 4,
                            fontSize: 12,
                            lineHeight: 1.3,
                            color: "#4B6484",
                            maxWidth: 500,
                        }}
                    >
                        Manage BTS projects, search, access documents.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 7,
                        flexShrink: 0,
                    }}
                >
                    <div
                        className="project-dashboard-header-account"
                    >
                        <div
                            style={{
                                fontSize: 12,
                                color: "#31557F",
                            }}
                        >
                            {email}
                        </div>

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            style={{
                                border: "1px solid #CBD5E1",
                                borderRadius: 9,
                                background: "#FFFFFF",
                                color: "#334155",
                                padding: "5px 10px",
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: loggingOut
                                    ? "default"
                                    : "pointer",
                                boxShadow:
                                    "0 2px 8px rgba(15,23,42,.05)",
                            }}
                        >
                            {loggingOut
                                ? "Logging out..."
                                : "Sign out"}
                        </button>
                    </div>

                    <div
                        className="project-dashboard-header-summary"
                    >
                        <SummaryCard
                            icon="folder"
                            title="Total Projects"
                            value={String(totalProjects)}
                        />

                        <SummaryCard
                            icon="clock"
                            title="Last scan"
                            value={formatLastScan(lastScan)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function SummaryCard({
    icon,
    title,
    value,
}: {
    icon: "folder" | "clock";
    title: string;
    value: string;
}) {
    return (
        <div
            className="project-dashboard-summary-card"
            style={{
                minHeight: 62,
                boxSizing: "border-box",
                padding: "7px 9px",
                border: "1px solid #E2E8F0",
                borderRadius: 11,
                background: "rgba(255,255,255,.92)",
                boxShadow: "0 6px 18px rgba(15,23,42,.06)",
                display: "grid",
                gridTemplateColumns: "27px 1fr",
                columnGap: 7,
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: 27,
                    height: 27,
                    borderRadius: 8,
                    background:
                        icon === "folder"
                            ? "#E8F1FF"
                            : "#FFF3E8",
                    color:
                        icon === "folder"
                            ? "#2563EB"
                            : "#F97316",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {icon === "folder" ? (
                    <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                    </svg>
                ) : (
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="8.5" />
                        <path d="M12 7v5l3 2" />
                    </svg>
                )}
            </div>

            <div>
                <div
                    style={{
                        fontSize: 11,
                        color: "#64748B",
                        marginBottom: 3,
                    }}
                >
                    {title}
                </div>

                <div
                    className="project-dashboard-summary-value"
                    style={{
                        fontSize: icon === "clock" ? 14 : 17,
                        fontWeight: 750,
                        lineHeight: 1.1,
                        color: "#102A56",
                        whiteSpace:
                            icon === "clock"
                                ? "normal"
                                : "nowrap",
                        overflowWrap: "anywhere",
                        minWidth: 0,
                    }}
                >
                    {value}
                </div>
            </div>
        </div>
    );
}
