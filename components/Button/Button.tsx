import { ButtonHTMLAttributes } from "react";
import type { ReactNode } from "react";

const VARIANTS = {
    primary: {
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "1px solid transparent",
    },

    secondary: {
        backgroundColor: "#ffffff",
        color: "#111827",
        border: "1px solid #d1d5db",
    },

    danger: {
        backgroundColor: "#dc2626",
        color: "#ffffff",
        border: "1px solid transparent",
    },
} as const;

const SIZES = {
    sm: {
        height: 32,
        padding: "0 12px",
        fontSize: 13,
    },

    md: {
        height: 40,
        padding: "0 16px",
        fontSize: 14,
    },

    lg: {
        height: 48,
        padding: "0 20px",
        fontSize: 15,
    },
} as const;

type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {

    variant?: ButtonVariant;

    size?: "sm" | "md" | "lg";

    loading?: boolean;

    startIcon?: ReactNode;

    endIcon?: ReactNode;
}

export default function Button({

    children,

    variant = "primary",

    size = "md",

    loading = false,

    startIcon,

    endIcon,

    disabled,

    style,

    ...props

}: ButtonProps) {

    const variantStyle = VARIANTS[variant];

    const sizeStyle = SIZES[size];

    return (
        <button
            {...props}
            type={props.type ?? "button"}
            disabled={disabled || loading}
            style={{

                minWidth: 0,

                borderRadius: 10,

                cursor:
                    disabled || loading
                        ? "not-allowed"
                        : "pointer",

                opacity:
                    disabled || loading
                        ? 0.6
                        : 1,

                transition:
                    "all .2s ease",

                display: "inline-flex",

                alignItems: "center",

                justifyContent: "center",

                whiteSpace: "nowrap",

                userSelect: "none",

                ...variantStyle,

                ...sizeStyle,

                outline: "none",

                ...style,

            }}
        >
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                }}
            >
                {loading && (
                    <span
                        style={{
                            fontSize: "0.9em",
                        }}
                    >
                        ⏳
                    </span>
                )}

                {!loading && startIcon}

                <span>{children}</span>

                {!loading && endIcon}
            </span>
        </button>
    );
}