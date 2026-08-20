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
    return (
        <div
            onClick={onClick}
            style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 14,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(15,23,42,.06)",
                cursor: onClick ? "pointer" : "default",
                transition: "all .2s ease",
            }}
        >
            <div
                style={{
                    padding: "12px 14px",
                    background: "#1E3A8A",
                    color: "#FFFFFF",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
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
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#FFFFFF",
                        }}
                    >
                        {name}
                    </div>

                    <div
                        style={{
                            marginTop: 2,
                            color: "#DBEAFE",
                            fontSize: 13,
                        }}
                    >
                        {customer}
                    </div>
                </div>
            </div>

            <div
                style={{
                    padding: "10px 12px 12px",
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
                        marginTop: 6,
                        height: 6,
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
                            marginTop: 12,
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
                                    padding: "6px 12px",
                                    fontSize: 13,
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
                                    padding: "6px 12px",
                                    fontSize: 13,
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