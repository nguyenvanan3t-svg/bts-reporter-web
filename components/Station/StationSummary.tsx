interface Props {
    total: number;
    survey: number;
    word: number;
    visio: number;
    pdf: number;
}

export default function StationSummary({
    total,
    survey,
    word,
    visio,
    pdf,
}: Props) {
    return (
        <div
            style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 20,
                marginTop: 24,
                marginBottom: 24,
                background: "#fafafa",
            }}
        >
            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 16,
                }}
            >
                Station Summary
            </h3>

            <div
                style={{
                    display: "flex",
                    gap: 32,
                    flexWrap: "wrap",
                }}
            >
                <Item
                    label="Total"
                    value={total}
                />

                <Item
                    label="Survey"
                    value={survey}
                />

                <Item
                    label="Word"
                    value={word}
                />

                <Item
                    label="Visio"
                    value={visio}
                />

                <Item
                    label="PDF"
                    value={pdf}
                />
            </div>
        </div>
    );
}

interface ItemProps {
    label: string;
    value: number;
}

function Item({
    label,
    value,
}: ItemProps) {
    return (
        <div
            style={{
                minWidth: 80,
            }}
        >
            <div
                style={{
                    fontSize: 12,
                    color: "#6b7280",
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize: 26,
                    fontWeight: 700,
                }}
            >
                {value}
            </div>
        </div>
    );
}