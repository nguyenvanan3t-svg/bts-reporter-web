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
                borderRadius: 18,
                padding: 12,
                boxShadow: "0 2px 10px rgba(15,23,42,.06)",
                cursor: onClick ? "pointer" : "default",
                transition: "all .2s ease",
            }}
        >
            <div
                style={{
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
                        background: "#F1F5F9",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 700,
                        color: "#64748B",
                    }}
                >
                    P
                </div>

                <div
                    style={{
                        flex: 1,
                    }}
                >
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        {name}
                    </div>

                    <div
                        style={{
                            marginTop: 2,
                            color: "#64748B",
                            fontSize: 13,
                        }}
                    >
                        {customer}
                    </div>
                </div>
            </div>

            <div
                style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <span
                    style={{
                        color: "#475569",
                        fontSize:13,
                        fontWeight: 600,
                    }}
                >
                    Progress
                </span>

                <span
                    style={{
                        fontWeight: 700,
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
        </div>
    );
}