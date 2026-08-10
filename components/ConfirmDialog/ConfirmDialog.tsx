"use client";
import { Button } from "@/components/Button";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(17,24,39,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    width: 480,
                    maxWidth: "90%",
                    background: "#fff",
                    borderRadius: 8,
                    padding: 24,
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,.2)",
                }}
            >
                <h3
                    style={{
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#111827",
                    }}
                >
                    {title}
                </h3>

                <p
                    style={{
                        marginTop: 16,
                        marginBottom: 24,
                        color: "#4b5563",
                        lineHeight: 1.6,
                        fontSize: 15,
                    }}
                >
                    {message}
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 16,
                        marginTop: 8,
                    }}
                >
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}