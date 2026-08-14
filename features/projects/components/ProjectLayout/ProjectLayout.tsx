type Props = {
    left: React.ReactNode;
    center: React.ReactNode;
    right: React.ReactNode;
};

export default function ProjectLayout({
    left,
    center,
    right,
}: Props) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "280px minmax(0, 1fr) 320px",
                gap: 16,
                alignItems: "start",
            }}
        >
            <div>{left}</div>

            <div>{center}</div>

            <div>{right}</div>
        </div>
    );
}