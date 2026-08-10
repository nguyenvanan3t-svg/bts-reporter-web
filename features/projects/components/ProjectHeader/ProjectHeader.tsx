import type { Project } from "../../types";

interface ProjectHeaderProps {

    project: Project;

}

export default function ProjectHeader({
    project,
}: ProjectHeaderProps) {

    return (
        <div
            style={{
                marginBottom: 32,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    color: "#64748b",
                    marginBottom: 12,
                }}
            >
                <span>Home</span>

                <span>&gt;</span>

                <span>Projects</span>

                <span>&gt;</span>

                <span>{project.name}</span>
            </div>

            <h1
                style={{
                    margin: 0,
                    fontSize: 34,
                    fontWeight: 700,
                    color: "#0f172a",
                }}
            >
                {project.name}
            </h1>
        </div>
    );

}