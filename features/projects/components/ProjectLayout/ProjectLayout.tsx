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
            className="grid items-start gap-3"
            style={{
                gridTemplateColumns:
                    "250px minmax(0, 1fr) 300px",
            }}
        >
            <div className="min-w-0">{left}</div>

            <div className="min-w-0">{center}</div>

            <div className="min-w-0">{right}</div>
        </div>
    );
}