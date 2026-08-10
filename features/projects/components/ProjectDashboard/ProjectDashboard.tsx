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
                gridTemplateColumns: "2fr 1fr",
                gap: 24,
                alignItems: "start",
            }}
        >
            <div>{left}</div>

            <div>{right}</div>
        </div>
    );
}