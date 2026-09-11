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
                project-layout
                grid
                grid-cols-1
                items-start
                gap-3
                lg:grid-cols-[250px_minmax(0,1fr)_300px]
            "
        >
            <div className="project-layout-left min-w-0">
                {left}
            </div>

            <div className="project-layout-center min-w-0">
                {center}
            </div>

            <div className="project-layout-right min-w-0">
                {right}
            </div>
        </div>
    );
}