"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setError("");
        setLoading(true);

        const supabase =
            createClient();

        const { error } =
            await supabase.auth.signInWithPassword(
                {
                    email,
                    password,
                },
            );

        if (error) {
            setError(
                "Email hoặc mật khẩu không đúng.",
            );

            setLoading(false);

            return;
        }

        router.push("/projects");
        router.refresh();
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f8fafc",
                padding: 24,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 32,
                    boxShadow:
                        "0 10px 30px rgba(15, 23, 42, 0.08)",
                }}
            >
                <div
                    style={{
                        marginBottom: 28,
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: 28,
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        BTS Reporter
                    </h1>

                    <p
                        style={{
                            marginTop: 8,
                            marginBottom: 0,
                            color: "#64748b",
                            fontSize: 15,
                            lineHeight: 1.5,
                        }}
                    >
                        Quản lý dự án và hồ sơ
                        BTS
                    </p>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div
                        style={{
                            marginBottom: 18,
                        }}
                    >
                        <label
                            style={{
                                display:
                                    "block",
                                marginBottom: 7,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#334155",
                            }}
                        >
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="Nhập email"
                            autoComplete="email"
                            required
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                height: 44,
                                padding:
                                    "0 12px",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius: 8,
                                fontSize: 14,
                                outline: "none",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            marginBottom: 18,
                        }}
                    >
                        <label
                            style={{
                                display:
                                    "block",
                                marginBottom: 7,
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#334155",
                            }}
                        >
                            Mật khẩu
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target
                                        .value,
                                )
                            }
                            placeholder="Nhập mật khẩu"
                            autoComplete="current-password"
                            required
                            style={{
                                width: "100%",
                                boxSizing:
                                    "border-box",
                                height: 44,
                                padding:
                                    "0 12px",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius: 8,
                                fontSize: 14,
                                outline: "none",
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                marginBottom: 16,
                                padding:
                                    "10px 12px",
                                background:
                                    "#fef2f2",
                                border:
                                    "1px solid #fecaca",
                                borderRadius: 8,
                                color: "#b91c1c",
                                fontSize: 14,
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            height: 44,
                            border: "none",
                            borderRadius: 8,
                            background:
                                loading
                                    ? "#93c5fd"
                                    : "#2563eb",
                            color: "#ffffff",
                            fontSize: 15,
                            fontWeight: 600,
                            cursor: loading
                                ? "default"
                                : "pointer",
                        }}
                    >
                        {loading
                            ? "Đang đăng nhập..."
                            : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </main>
    );
}