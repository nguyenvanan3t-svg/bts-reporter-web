type Props = {
    left: React.ReactNode;
    right: React.ReactNode;
};

export default function ProjectLayout({
    left,
    right,
}: Props) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "340px 1fr",
                gap: 24,
                alignItems: "start",
            }}
        >
            <div>{left}</div>

            <div>{right}</div>
        </div>
    );
}