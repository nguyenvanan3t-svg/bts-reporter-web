export default function ProjectDashboardHeader() {
    return (
        <div
            style={{
                marginBottom: 20,
            }}
        >
            <div
                style={{
                    fontSize: 34,
                    fontWeight: 700,
                    color: "#111827",
                    letterSpacing: "-0.03em",
                }}
            >
                Project Dashboard
            </div>

            <div
                style={{
                    marginTop: 8,
                    fontSize: 16,
                    lineHeight: 1.6,
                    color: "#64748B",
                    maxWidth: 720,
                }}
            >
                Manage BTS survey projects, search station history and access engineering documents from a single workspace.
            </div>
        </div>
    );
}