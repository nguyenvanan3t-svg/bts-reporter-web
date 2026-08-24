interface ProjectInformationProps {
    code: string;
    name: string;
    customer: string | null;
    year: number;
    status: string;
    description: string | null;
}

type InfoIconType =
    | "code"
    | "project"
    | "customer"
    | "year"
    | "status"
    | "description";

type InfoRowProps = {
    label: string;
    value: React.ReactNode;
    icon: InfoIconType;
    last?: boolean;
};

function InfoIcon({
    type,
}: {
    type: InfoIconType;
}) {
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
                <path d="m8 9-3 3 3 3" />
                <path d="m16 9 3 3-3 3" />
                <path d="m14 5-4 14" />
            </svg>
        );
    }

    if (type === "project") {
        return (
            <svg {...common}>
                <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                />
                <path d="M8 5V3h8v2" />
                <path d="M8 11h8M8 15h5" />
            </svg>
        );
    }

    if (type === "customer") {
        return (
            <svg {...common}>
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20c.8-3.4 3.1-5 7-5s6.2 1.6 7 5" />
            </svg>
        );
    }

    if (type === "year") {
        return (
            <svg {...common}>
                <rect
                    x="3"
                    y="4"
                    width="18"
                    height="17"
                    rx="2"
                />
                <path d="M16 2v4M8 2v4M3 9h18" />
            </svg>
        );
    }

    if (type === "status") {
        return (
            <svg {...common}>
                <circle cx="12" cy="12" r="9" />
                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <path d="M4 5h16v14H4z" />
            <path d="M8 9h8M8 13h6M8 17h4" />
        </svg>
    );
}

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
                gridTemplateColumns:
                    "112px minmax(0, 1fr)",
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
                        color: "#49698F",
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

export function ProjectInformation({
    code,
    name,
    customer,
    year,
    status,
    description,
}: ProjectInformationProps) {
    const statusText =
        status?.trim() || "PLANNING";

    const statusStyle = {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "4px 10px",
        borderRadius: 999,
        background: "#DBEAFE",
        color: "#1D4ED8",
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
    };

    return (
        <div>
            <div
                style={{
                    margin: "-16px -16px 8px -16px",
                    padding: "17px 16px 9px",
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
                        <rect
                            x="4"
                            y="3"
                            width="16"
                            height="18"
                            rx="2"
                        />
                        <path d="M8 7h8M8 11h8M8 15h5" />
                    </svg>
                </span>

                <span>Project Information</span>
            </div>

            <InfoRow
                icon="code"
                label="Code"
                value={code}
            />

            <InfoRow
                icon="project"
                label="Name"
                value={name}
            />

            <InfoRow
                icon="customer"
                label="Customer"
                value={customer ?? "-"}
            />

            <InfoRow
                icon="year"
                label="Year"
                value={year.toString()}
            />

            <InfoRow
                icon="status"
                label="Status"
                value={
                    <span style={statusStyle}>
                        <span
                            style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: "#2563EB",
                            }}
                        />
                        {statusText}
                    </span>
                }
            />

            <InfoRow
                icon="description"
                label="Description"
                value={description ?? "-"}
                last
            />
        </div>
    );
}