type StationInformationProps = {
    code: string;
    project: string;
    province: string;
    status: string;
    projectCode?: string;
    address?: string;
    excelSource?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

type InfoIconProps = {
    type:
        | "code"
        | "project"
        | "tag"
        | "location"
        | "address"
        | "file"
        | "status"
        | "date";
};

function InfoIcon({ type }: InfoIconProps) {
    const common = {
        width: 20,
        height: 20,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    if (type === "code") {
        return (
            <svg {...common}>
                <path d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
                <path d="M16 3h5v5" />
                <path d="M10 14 21 3" />
            </svg>
        );
    }

    if (type === "project") {
        return (
            <svg {...common}>
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M3 12h18" />
            </svg>
        );
    }

    if (type === "tag") {
        return (
            <svg {...common}>
                <path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0L3.4 13.4a2 2 0 0 1-.6-1.4V5a2 2 0 0 1 2-2h7a2 2 0 0 1 1.4.6l7.4 7a2 2 0 0 1 0 2.8Z" />
                <circle cx="8" cy="8" r="1.2" />
            </svg>
        );
    }

    if (type === "location") {
        return (
            <svg {...common}>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </svg>
        );
    }

    if (type === "address") {
        return (
            <svg {...common}>
                <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
                <path d="M9 3v15M15 6v15" />
            </svg>
        );
    }

    if (type === "file") {
        return (
            <svg {...common}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
            </svg>
        );
    }

    if (type === "status") {
        return (
            <svg {...common}>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M16 2v4M8 2v4M3 9h18" />
        </svg>
    );
}

type InfoRowProps = {
    label: string;
    value: React.ReactNode;
    icon: InfoIconProps["type"];
    last?: boolean;
};

function InfoRow({
    label,
    value,
    icon,
    last = false,
}: InfoRowProps) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "112px minmax(0, 1fr)",
                columnGap: 12,
                alignItems: "start",
                padding: "13px 0",
                borderBottom: last
                    ? "none"
                    : "1px solid #E5E7EB",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    minWidth: 0,
                    color: "#475569",
                    fontWeight: 600,
                    fontSize: 13,
                    lineHeight: 1.35,
                    whiteSpace: "nowrap",
                }}
            >
                <span
                    style={{
                        flex: "0 0 auto",
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#49698f",
                    }}
                >
                    <InfoIcon type={icon} />
                </span>

                <span>{label}</span>
            </div>

            <div
                style={{
                    minWidth: 0,
                    color: "#111827",
                    fontSize: 13,
                    lineHeight: 1.5,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                }}
            >
                {value}
            </div>
        </div>
    );
}

export default function StationInformation({
    code,
    project,
    projectCode,
    province,
    address,
    excelSource,
    status,
    createdAt,
    updatedAt,
}: StationInformationProps) {
    const isCompleted = status === "COMPLETED";

    const statusBadgeStyle = {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "4px 10px",
        borderRadius: 999,
        background: isCompleted ? "#DCFCE7" : "#FEF3C7",
        color: isCompleted ? "#15803D" : "#92400E",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.2,
    };

    return (
        <div>
            <div
                style={{
                    margin: "-16px -16px 8px -16px",
                    padding: "15px 16px",
                    background: "#1E3A8A",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 15,
                    lineHeight: 1.2,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span
                    style={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="5" y="3" width="14" height="18" rx="2" />
                        <path d="M9 3V2h6v1M9 8h6M9 12h6M9 16h4" />
                    </svg>
                </span>

                <span>Station Information</span>
            </div>

            <div style={{ paddingTop: 2 }}>
                <InfoRow icon="code" label="Code" value={code} />
                <InfoRow icon="project" label="Project" value={project} />
                <InfoRow
                    icon="tag"
                    label="Project Code"
                    value={projectCode ?? "-"}
                />
                <InfoRow
                    icon="location"
                    label="Province"
                    value={province}
                />
                <InfoRow
                    icon="address"
                    label="Address"
                    value={address ?? "-"}
                />
                <InfoRow
                    icon="file"
                    label="Excel Source"
                    value={excelSource ?? "-"}
                />
                <InfoRow
                    icon="status"
                    label="Status"
                    value={
                        <span style={statusBadgeStyle}>
                            <span
                                style={{
                                    width: 7,
                                    height: 7,
                                    borderRadius: "50%",
                                    background: isCompleted
                                        ? "#15803D"
                                        : "#D97706",
                                }}
                            />
                            {isCompleted ? "Complete" : "Pending"}
                        </span>
                    }
                />
                <InfoRow
                    icon="date"
                    label="Created"
                    value={createdAt ?? "-"}
                />
                <InfoRow
                    icon="date"
                    label="Updated"
                    value={updatedAt ?? "-"}
                    last
                />
            </div>
        </div>
    );
}
