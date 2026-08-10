import { ReactNode } from "react";

type IconButtonProps = {
    icon: ReactNode;
    title?: string;
    onClick?: () => void;
    disabled?: boolean;
};

export default function IconButton({
    icon,
    title,
    onClick,
    disabled,
}: IconButtonProps) {
    return (
        <button
            title={title}
            onClick={onClick}
            disabled={disabled}
            style={{
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: 8,
                background: "transparent",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                transition: "all .2s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
            }}
        >
            {icon}
        </button>
    );
}