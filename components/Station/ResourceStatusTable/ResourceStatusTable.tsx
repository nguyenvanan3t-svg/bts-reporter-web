type ResourceItem = {
    resource: string;
    status: "FOUND" | "MISSING";
    fileName: string;
    size: string;
    updated: string;
};

type Props = {
    items: ResourceItem[];
};

export default function ResourceStatusTable({
    items,
}: Props) {
    return (
        <div
            style={{
                marginTop: 24,
                border: "1px solid #E5E7EB",
                borderRadius: 12,
                background: "#FFFFFF",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: "20px 24px",
                    borderBottom: "1px solid #E5E7EB",
                }}
            >
                <div
                    style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    Resource Status
                </div>

                <div
                    style={{
                        marginTop: 6,
                        fontSize: 14,
                        color: "#64748B",
                    }}
                >
                    Latest resource scan result from FTP server.
                </div>
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr
                        style={{
                            background: "#F8FAFC",
                        }}
                    >
                        <th
                            style={{
                                ...thStyle,
                                width: "15%",
                            }}
                        >
                            Resource
                        </th>
                        <th
                            style={{
                                ...thStyle,
                                width: "15%",
                            }}
                        >
                            Status
                        </th>
                        <th
                            style={{
                                ...thStyle,
                                width: "40%",
                            }}
                        >
                            File name
                        </th>
                        <th
                            style={{
                                ...thStyle,
                                width: "15%",
                            }}
                        >
                            Size
                        </th>
                        <th
                            style={{
                                ...thStyle,
                                width: "15%",
                            }}
                        >
                            Updated
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item, index) => (
                        <tr
                            key={item.resource}
                            style={{
                                background:
                                    index % 2 === 0
                                        ? "#FFFFFF"
                                        : "#FAFAFA",
                            }}
                        >
                            <td style={tdStyle}>
                                {item.resource}
                            </td>

                            <td style={tdStyle}>
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: "4px 10px",
                                        borderRadius: 999,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        background:
                                            item.status === "FOUND"
                                                ? "#DCFCE7"
                                                : "#FEE2E2",
                                        color:
                                            item.status === "FOUND"
                                                ? "#15803D"
                                                : "#B91C1C",
                                    }}
                                >
                                    {item.status}
                                </span>
                            </td>

                            <td
                                style={{
                                    ...tdStyle,
                                    color:
                                        item.fileName === "-"
                                            ? "#94A3B8"
                                            : "#2563EB",
                                    fontWeight:
                                        item.fileName === "-"
                                            ? 400
                                            : 500,
                                }}
                            >
                                {item.fileName}
                            </td>

                            <td style={tdStyle}>
                                {item.size}
                            </td>

                            <td style={tdStyle}>
                                {item.updated}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "14px 18px",
    fontWeight: 700,
    fontSize: 14,
    borderBottom: "1px solid #E5E7EB",
};

const tdStyle: React.CSSProperties = {
    padding: "16px 18px",
    borderBottom: "1px solid #F1F5F9",
    fontSize: 14,
};