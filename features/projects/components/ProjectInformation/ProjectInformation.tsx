interface ProjectInformationProps {
    code: string;
    name: string;
    customer: string | null;
    year: number;
    status: string;
    description: string | null;
}

type InfoRowProps = {
    label: string;
    value: string;
};

function InfoRow({
    label,
    value,
}: InfoRowProps) {
    return (
        <div
            style={{
                marginBottom: 18,
            }}
        >
            <div
                style={{
                    fontSize: 12,
                    color: "#64748b",
                    marginBottom: 4,
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#0f172a",
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

    return (
        <div>

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                }}
            >
                Project Information
            </h3>

            <div>

                <InfoRow
                    label="Code"
                    value={code}
                />

                <InfoRow
                    label="Name"
                    value={name}
                />

                <InfoRow
                    label="Customer"
                    value={customer ?? "-"}
                />

                <InfoRow
                    label="Year"
                    value={year.toString()}
                />

                <div
                    style={{
                        marginBottom: 18,
                    }}
                >
                    <div
                        style={{
                            fontSize: 12,
                            color: "#64748b",
                            marginBottom: 4,
                        }}
                    >
                        Status
                    </div>

                    <span
                        style={{
                            display: "inline-block",
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        {status}
                    </span>
                </div>

                <InfoRow
                    label="Description"
                    value={description ?? "-"}
                />

            </div>

        </div>
    );

}