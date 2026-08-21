"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
    totalProjects: number;
};

export default function ProjectDashboardHeader({
    totalProjects,
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
                marginBottom: 16,
                padding: "16px 24px",
                border: "1px solid #DCE8F7",
                borderRadius: 20,
                background:
                    "linear-gradient(135deg, #EFF6FF 0%, #EAF3FF 55%, #F8FBFF 100%)",
                boxShadow: "0 8px 28px rgba(37,99,235,.07)",
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
                style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
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
                            fontSize: 27,
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
                            marginTop: 6,
                            fontSize: 13,
                            lineHeight: 1.4,
                            color: "#4B6484",
                            maxWidth: 500,
                        }}
                    >
                        Manage BTS survey projects, search station
                        history and access engineering documents from
                        a single workspace.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 10,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 13,
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
                                padding: "8px 14px",
                                fontSize: 13,
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
                                : "Đăng xuất"}
                        </button>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 18,
                        }}
                    >
                        <SummaryCard
                            icon="folder"
                            title="Total Projects"
                            value={String(totalProjects)}
                            caption="Projects"
                        />

                        <SummaryCard
                            icon="clock"
                            title="Last scan"
                            value="—"
                            caption="Latest scan time"
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
    caption,
}: {
    icon: "folder" | "clock";
    title: string;
    value: string;
    caption: string;
}) {
    return (
        <div
            style={{
                width: 190,
                minHeight: 78,
                boxSizing: "border-box",
                padding: "10px 12px",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                background: "rgba(255,255,255,.92)",
                boxShadow: "0 6px 18px rgba(15,23,42,.06)",
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                columnGap: 8,
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
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
                    style={{
                        fontSize: 19,
                        fontWeight: 750,
                        lineHeight: 1.1,
                        color: "#102A56",
                    }}
                >
                    {value}
                </div>

                <div
                    style={{
                        marginTop: 3,
                        fontSize: 10,
                        color: "#64748B",
                    }}
                >
                    {caption}
                </div>
            </div>
        </div>
    );
}
