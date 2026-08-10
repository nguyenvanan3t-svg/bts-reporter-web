import type {
    PreviewStation,
} from "@/features/stations/types";

interface Props {
    stations: PreviewStation[];
}

function ActionBadge({
    action,
}: {
    action: PreviewStation["action"];
}) {

    const config = {

        ADD: {
            text: "Added",
            color: "#16a34a",
        },

        UPDATE: {
            text: "Updated",
            color: "#f59e0b",
        },

        REMOVE: {
            text: "Removed",
            color: "#dc2626",
        },

        RESTORE: {
            text: "Restored",
            color: "#16a34a",
        },

        UNCHANGED: {
            text: "Same",
            color: "#6b7280",
        },

    };

    const item = config[action];

    return (

        <span
            style={{
                background: `${item.color}20`,
                color: item.color,
                padding: "2px 8px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
            }}
        >
            {item.text}
        </span>

    );

}

export default function ImportPreview({
    stations,
}: Props) {

    return (

        <div
            style={{
                marginTop: 24,
                border: "1px solid #ddd",
                borderRadius: 8,
                overflow: "hidden",
            }}
        >

            <div
                style={{
                    padding: "12px 16px",
                    background: "#f5f5f5",
                    fontWeight: 600,
                }}
            >
                Preview ({stations.length} stations)
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >

                <thead>

                    <tr>

                        <th style={thStyle}>#</th>

                        <th style={thStyle}>Action</th>

                        <th style={thStyle}>Station Code</th>

                        <th style={thStyle}>Province</th>

                        <th style={thStyle}>Address</th>

                    </tr>

                </thead>

                <tbody>

                    {stations.map((station, index) => (

                        <tr key={`${station.action}-${station.code}`}>

                            <td style={tdStyle}>
                                {index + 1}
                            </td>

                            <td style={tdStyle}>
                                <ActionBadge
                                    action={station.action}
                                />
                            </td>

                            <td style={tdStyle}>
                                {station.code}
                            </td>

                            <td style={tdStyle}>
                                {station.province}
                            </td>

                            <td style={tdStyle}>
                                {station.address}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

const thStyle = {

    padding: 10,

    borderBottom: "1px solid #ddd",

    textAlign: "left" as const,

};

const tdStyle = {

    padding: 10,

    borderBottom: "1px solid #eee",

};