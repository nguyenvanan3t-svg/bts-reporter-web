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
            className="project-dashboard-layout"
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
