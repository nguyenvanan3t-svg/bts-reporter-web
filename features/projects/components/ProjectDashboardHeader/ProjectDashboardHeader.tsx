"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function ProjectDashboardHeader() {
    const router = useRouter();

    const [email, setEmail] =
        useState<string>("");

    const [loggingOut, setLoggingOut] =
        useState(false);

    useEffect(() => {
        const supabase =
            createClient();

        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            setEmail(
                user?.email ?? "",
            );
        }

        loadUser();
    }, []);

    async function handleLogout() {
        setLoggingOut(true);

        const supabase =
            createClient();

        await supabase.auth.signOut();

        router.push("/");
        router.refresh();
    }

    return (
        <div
            style={{
                marginBottom: 20,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "flex-start",
                    gap: 24,
                }}
            >
                <div
                    style={{
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            fontSize: 34,
                            fontWeight: 700,
                            color: "#111827",
                            letterSpacing:
                                "-0.03em",
                        }}
                    >
                        Project Dashboard
                    </div>

                    <div
                        style={{
                            marginTop: 8,
                            fontSize: 16,
                            lineHeight: 1.6,
                            color: "#64748B",
                            maxWidth: 720,
                        }}
                    >
                        Manage BTS survey
                        projects, search
                        station history and
                        access engineering
                        documents from a
                        single workspace.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        flexShrink: 0,
                        paddingTop: 6,
                    }}
                >
                    <div
                        style={{
                            fontSize: 14,
                            color: "#475569",
                        }}
                    >
                        {email}
                    </div>

                    <button
                        type="button"
                        onClick={
                            handleLogout
                        }
                        disabled={loggingOut}
                        style={{
                            border: "1px solid #cbd5e1",
                            borderRadius: 8,
                            background:
                                "#ffffff",
                            color: "#334155",
                            padding:
                                "8px 14px",
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: loggingOut
                                ? "default"
                                : "pointer",
                        }}
                    >
                        {loggingOut
                            ? "Đang thoát..."
                            : "Đăng xuất"}
                    </button>
                </div>
            </div>
        </div>
    );
}