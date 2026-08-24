type ResourceItem = {
    resource: string;
    status: "FOUND" | "MISSING";
    fileName: string;
    path: string;
    size: string;
    updated: string;
};

type Props = {
    items: ResourceItem[];
};

function breakableText(value: string) {
    if (value === "-") return value;
    return value.replace(/([_\\/.-])/g, "$1\u200B");
}

export default function ResourceStatusTable({
    items,
}: Props) {
    return (
        <div
            style={{
                marginTop: 12,
                border: "1px solid #E2E8F0",
                borderRadius: 10,
                background: "#FFFFFF",
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(15, 23, 42, 0.03)",
            }}
        >
            {/* Header mới: trắng + accent xanh, thay toàn bộ thanh xanh cũ */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "9px 14px",
                    background: "#FFFFFF",
                    borderBottom: "1px solid #E2E8F0",
                    borderLeft: "4px solid #2563EB",
                }}
            >
                <div style={{ minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: 15,
                            lineHeight: 1.2,
                            fontWeight: 700,
                            color: "#0F172A",
                        }}
                    >
                        Resource Status
                    </div>

                    <div
                        style={{
                            marginTop: 2,
                            fontSize: 10.5,
                            lineHeight: 1.3,
                            color: "#64748B",
                        }}
                    >
                        Latest resource scan result from FTP server.
                    </div>
                </div>
            </div>

            <table
                style={{
                    width: "100%",
                    maxWidth: "100%",
                    tableLayout: "fixed",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                        <th style={{ ...thStyle, width: "10%" }}>
                            Resource
                        </th>
                        <th style={{ ...thStyle, width: "10%" }}>
                            Status
                        </th>
                        <th style={{ ...thStyle, width: "30%" }}>
                            File name
                        </th>
                        <th style={{ ...thStyle, width: "30%" }}>
                            Path (FTP)
                        </th>
                        <th style={{ ...thStyle, width: "10%" }}>
                            Size
                        </th>
                        <th style={{ ...thStyle, width: "10%" }}>
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
                                        display: "inline-flex",
                                        alignItems: "center",
                                        padding: "3px 8px",
                                        borderRadius: 999,
                                        fontSize: 10.5,
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
                                {breakableText(item.fileName)}
                            </td>

                            <td
                                style={{
                                    ...tdStyle,
                                    color:
                                        item.path === "-"
                                            ? "#94A3B8"
                                            : "#475569",
                                    fontSize: 11.5,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {breakableText(item.path)}
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
    padding: "7px 9px",
    fontWeight: 700,
    fontSize: 11.5,
    color: "#334155",
    borderBottom: "1px solid #E2E8F0",
    boxSizing: "border-box",
    whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
    padding: "7px 9px",
    borderBottom: "1px solid #F1F5F9",
    fontSize: 12,
    color: "#0F172A",
    boxSizing: "border-box",
    minWidth: 0,
    maxWidth: 0,
    overflowWrap: "anywhere",
    verticalAlign: "middle",
};