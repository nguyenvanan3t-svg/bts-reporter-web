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
            className="
                grid
                grid-cols-1
                items-start
                gap-3
                lg:grid-cols-[250px_minmax(0,1fr)_300px]
            "
        >
            <div className="min-w-0">{left}</div>

            <div className="min-w-0">{center}</div>

            <div className="min-w-0">{right}</div>
        </div>
    );
}