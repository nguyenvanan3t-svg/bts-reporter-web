interface ProjectMetricsProps {
    total: number;
    survey: number;
    word: number;
    visio: number;
    pdf: number;
}

const cardStyle: React.CSSProperties = {
    flex: 1,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,.06)",
};

export function ProjectMetrics({
    total,
    survey,
    word,
    visio,
    pdf,
}: ProjectMetricsProps) {

    const items = [
        {
            title: "Total Stations",
            value: total,
        },
        {
            title: "Surveyed",
            value: survey,
        },
        {
            title: "Word Docs",
            value: word,
        },
        {
            title: "Visio",
            value: visio,
        },
        {
            title: "PDF",
            value: pdf,
        },
    ];

    return (
        <div
            style={{
                display: "flex",
                gap: 16,
                marginBottom: 20,
            }}
        >
            {items.map((item) => (
                <div
                    key={item.title}
                    style={cardStyle}
                >
                    <div
                        style={{
                            fontSize: 36,
                            fontWeight: 700,
                        }}
                    >
                        {item.value}
                    </div>

                    <div
                        style={{
                            marginTop: 8,
                            color: "#666",
                            fontSize: 14,
                        }}
                    >
                        {item.title}
                    </div>
                </div>
            ))}
        </div>
    );
}