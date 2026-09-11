"use client";
import { useState } from "react";

type Props = {
    id?: string;

    code?: string;

    name: string;

    customer: string;

    year?: number;

    status?: string;

    progress: number;

    onClick?: () => void;

    onEdit?: () => void;

    onDelete?: () => void;
};

export default function ProjectCard({
    name,
    customer,
    year,
    status,
    progress,
    onClick,
    onEdit,
    onDelete,
}: Props) {
    const [opening, setOpening] =
        useState(false);

    function handleCardClick() {
        if (!onClick || opening) {
            return;
        }

        /*
         * Phản hồi UI ngay lập tức.
         * Người dùng biết click đã được nhận.
         */
        setOpening(true);

        onClick();
    }

    return (
        <div
            onClick={handleCardClick}
            style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                overflow: "hidden",
                cursor:
                    onClick && !opening
                        ? "pointer"
                        : "default",

                transition:
                    "transform .1s ease, opacity .15s ease, box-shadow .15s ease",

                opacity: opening ? 0.72 : 1,

                transform:
                    opening
                        ? "scale(0.985)"
                        : "scale(1)",

                boxShadow: opening
                    ? "0 2px 8px rgba(15,23,42,.04)"
                    : "0 2px 10px rgba(15,23,42,.06)",

                position: "relative",
            }}
        >
            {opening && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                            "rgba(255,255,255,.78)",
                        backdropFilter: "blur(1.5px)",
                        WebkitBackdropFilter:
                            "blur(1.5px)",
                        borderRadius: 14,
                    }}
                >
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            borderRadius: 9,
                            background: "#ffffff",
                            border: "1px solid #dbe3ef",
                            boxShadow:
                                "0 4px 14px rgba(15,23,42,.10)",
                            color: "#334155",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        <span
                            className="button-loading-spinner"
                            aria-hidden="true"
                        />

                        Opening...
                    </div>
                </div>
            )}

            <div
                style={{
                    padding: "9px 12px",
                    background: "#1E3A8A",
                    color: "#FFFFFF",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 9,
                        background: "rgba(255,255,255,.16)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        flexShrink: 0,
                    }}
                >
                    P
                </div>

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#FFFFFF",
                        }}
                    >
                        {name}
                    </div>

                    <div
                        style={{
                            marginTop: 1,
                            color: "#DBEAFE",
                            fontSize: 12,
                        }}
                    >
                        {customer}
                    </div>
                </div>
            </div>

            <div
                style={{
                    padding: "8px 10px 9px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            color: "#475569",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        Progress
                    </span>

                    <span
                        style={{
                            fontWeight: 700,
                            color: "#111827",
                            fontSize: 13,
                        }}
                    >
                        {progress}%
                    </span>
                </div>

                <div
                    style={{
                        marginTop: 5,
                        height: 5,
                        borderRadius: 999,
                        background: "#E2E8F0",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: "#2563EB",
                            borderRadius: 999,
                        }}
                    />
                </div>

                {(onEdit || onDelete) && (
                    <div
                        style={{
                            marginTop: 9,
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                        }}
                    >
                        {onEdit && (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onEdit();
                                }}
                                style={{
                                    border: "1px solid #CBD5E1",
                                    background: "#FFFFFF",
                                    color: "#334155",
                                    borderRadius: 8,
                                    padding: "5px 10px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Edit
                            </button>
                        )}

                        {onDelete && (
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onDelete();
                                }}
                                style={{
                                    border: "1px solid #FCA5A5",
                                    background: "#FFFFFF",
                                    color: "#DC2626",
                                    borderRadius: 8,
                                    padding: "5px 10px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}