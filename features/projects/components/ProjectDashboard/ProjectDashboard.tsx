type Props = {
    left: React.ReactNode;
    right: React.ReactNode;
};

export default function ProjectDashboard({
    left,
    right,
}: Props) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "minmax(0, 1.9fr) minmax(360px, 0.9fr)",
                gap: 20,
                alignItems: "start",
            }}
        >
            <div
                style={{
                    minWidth: 0,
                    padding: "4px 0",
                }}
            >
                {left}
            </div>

            <div
                style={{
                    minWidth: 0,
                }}
            >
                {right}
            </div>
        </div>
    );
}
