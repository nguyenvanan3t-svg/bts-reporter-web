interface StationSummaryProps {
    total: number;
    survey: number;
    word: number;
    visio: number;
    pdf: number;
}

type SummaryCardProps = {
    title: string;
    value: number;
    icon: string;
};

function SummaryCard({
    title,
    value,
    icon,
}: SummaryCardProps) {
    return (
        <div
            style={{
                flex: 1,
                minWidth: 140,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 20,
                boxShadow:
                    "0 2px 10px rgba(15,23,42,0.05)",
            }}
        >
            <div
                style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    marginBottom: 16,
                }}
            >
                {icon}
            </div>

            <div
                style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1,
                }}
            >
                {value}
            </div>

            <div
                style={{
                    marginTop: 10,
                    color: "#64748b",
                    fontSize: 14,
                }}
            >
                {title}
            </div>
        </div>
    );
}

export function StationSummary({
    total,
    survey,
    word,
    visio,
    pdf,
}: StationSummaryProps) {

    return (

        <div
            style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
            }}
        >
            <SummaryCard
                title="Total Stations"
                value={total}
                icon="📡"
            />

            <SummaryCard
                title="Surveyed"
                value={survey}
                icon="📍"
            />

            <SummaryCard
                title="Word Docs"
                value={word}
                icon="📄"
            />

            <SummaryCard
                title="Visio"
                value={visio}
                icon="🗂️"
            />

            <SummaryCard
                title="PDF"
                value={pdf}
                icon="📕"
            />
        </div>

    );

}