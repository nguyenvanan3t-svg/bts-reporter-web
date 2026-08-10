"use client";

import ProjectCard from "../ProjectCard";
import { useRouter } from "next/navigation";

type Props = {
    projects: {
        id: string;
        code: string;
        name: string;
        customer?: string;
        year: number;
        status: string;
    }[];
};

export default function ProjectLeftPanel({
    projects,
}: Props) {
    const router = useRouter();
    return (
        <div>

            {/* Title */}

            <div
                style={{
                    marginBottom: 20,
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#111827",
                }}
            >
                Current Projects
            </div>

            <div
                style={{
                    marginTop: 6,
                    marginBottom: 18,
                    color: "#64748B",
                    fontSize: 14,
                }}
            >
                Select a project to manage stations and engineering documents.
            </div>

            {/* Project List */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 18,
                }}
            >
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        code={project.code}
                        name={project.name}
                        customer={project.customer ?? ""}
                        year={project.year}
                        status={project.status}
                        progress={0}
                        onClick={() => router.push(`/projects/${project.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}