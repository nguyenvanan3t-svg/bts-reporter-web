"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/features/projects/types";
import ProjectCard from "../ProjectCard";
import ProjectYearGroup from "../ProjectYearGroup";

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

    const groupedProjects = useMemo(() => {
        const groups = new Map<number, Project[]>();

        for (const project of projects) {
            const year = project.year;

            if (!groups.has(year)) {
                groups.set(year, []);
            }

            groups.get(year)!.push(project);
        }

        return Array.from(groups.entries()).sort(
            ([yearA], [yearB]) =>
                yearB - yearA,
        );
    }, [projects]);

    return (
        <section>
            <div className="section-title">
                <div>
                    <h2>Current Projects</h2>
                    <p>
                        Select a project to manage
                        stations and engineering
                        documents.
                    </p>
                </div>
            </div>

            {groupedProjects.map(
                ([year, yearProjects], index) => (
                    <ProjectYearGroup
                        key={year}
                        year={year}
                        projects={yearProjects}
                        progressByProject={
                            progressByProject
                        }
                        onEdit={onEdit}
                        onDelete={onDelete}
                        defaultOpen={index === 0}
                        onProjectClick={(
                            project,
                        ) =>
                            router.push(
                                `/projects/${project.id}`,
                            )
                        }
                    />
                ),
            )}
        </section>
    );
}