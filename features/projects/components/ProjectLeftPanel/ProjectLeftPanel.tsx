"use client";

import type { Project } from "@/features/projects/types";
import ProjectCard from "../ProjectCard";
import { useRouter } from "next/navigation";

type Props = {
    projects: Project[];
    progressByProject: Record<string, number>;
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
};

export default function ProjectLeftPanel({
    projects,
    progressByProject,
    onEdit,
    onDelete,
}: Props) {
    const router = useRouter();

    return (
        <section
            style={{
                minWidth: 0,
            }}
        >
            <div
                style={{
                    marginBottom: 6,
                    fontSize: 24,
                    fontWeight: 750,
                    lineHeight: 1.2,
                    color: "#102A56",
                    letterSpacing: "-0.02em",
                }}
            >
                Current Projects
            </div>

            <div
                style={{
                    marginBottom: 20,
                    color: "#64748B",
                    fontSize: 13,
                    lineHeight: 1.6,
                }}
            >
                Select a project to manage stations and engineering
                documents.
            </div>

            <div
                className="project-list-grid"
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
                        progress={
                            progressByProject[project.id] ?? 0
                        }
                        onClick={() =>
                            router.push(
                                `/projects/${project.id}`,
                            )
                        }
                        onEdit={() => onEdit(project)}
                        onDelete={() => onDelete(project)}
                    />
                ))}
            </div>
        </section>
    );
}
