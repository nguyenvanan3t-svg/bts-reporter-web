import type { Project } from "../../types";
import Link from "next/link";

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
                    fontSize: 15,
                    color: "#2563eb",
                    marginBottom: 14,
                }}
            >
                <Link
                    href="/"
                    className="text-blue-600 transition-colors hover:text-blue-700"
                >
                    Home
                </Link>

                <span>&gt;</span>

                <Link
                    href="/projects"
                    className="text-blue-600 transition-colors hover:text-blue-700"
                >
                    Projects
                </Link>

                <span>&gt;</span>

                <span
                    style={{
                        color: "#1e293b",
                        fontWeight: 600,
                    }}
                >
                    {project.name}
                </span>
            </div>

            <div
                style={{
                    marginBottom: 6,
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#111827",
                }}
            >
                Project Detail
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