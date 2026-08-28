"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Project } from "@/features/projects/types";
import ProjectCard from "../ProjectCard";

type Props = {
    year: number;
    projects: Project[];
    progressByProject: Record<string, number>;
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
    defaultOpen?: boolean;
    onProjectClick: (project: Project) => void;
};

export default function ProjectYearGroup({
    year,
    projects,
    progressByProject,
    onEdit,
    onDelete,
    defaultOpen = false,
    onProjectClick,
}: Props) {
    const [open, setOpen] =
        useState(defaultOpen);

    return (
        <section
            style={{
                marginBottom: 22,
            }}
        >
            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (value) =>
                            !value,
                    )
                }
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: 12,
                    padding: "10px 12px",
                    margin: 0,
                    border: 0,
                    borderBottom:
                        "1px solid #E2E8F0",
                    background:
                        "transparent",
                    color: "#102A56",
                    cursor: "pointer",
                    textAlign: "left",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        minWidth: 0,
                    }}
                >
                    {open ? (
                        <ChevronDown
                            size={18}
                            strokeWidth={2.5}
                        />
                    ) : (
                        <ChevronRight
                            size={18}
                            strokeWidth={2.5}
                        />
                    )}

                    <span
                        style={{
                            fontSize: 18,
                            fontWeight: 750,
                            lineHeight: 1.2,
                        }}
                    >
                        {year}
                    </span>
                </div>

                <span
                    style={{
                        flexShrink: 0,
                        color: "#64748B",
                        fontSize: 12,
                        fontWeight: 600,
                    }}
                >
                    {projects.length}{" "}
                    {projects.length === 1
                        ? "Project"
                        : "Projects"}
                </span>
            </button>

            {open && (
                <div
                    className="project-list-grid"
                    style={{
                        marginTop: 14,
                    }}
                >
                    {projects.map(
                        (project) => (
                            <ProjectCard
                                key={
                                    project.id
                                }
                                id={
                                    project.id
                                }
                                code={
                                    project.code
                                }
                                name={
                                    project.name
                                }
                                customer={
                                    project.customer ??
                                    ""
                                }
                                year={
                                    project.year
                                }
                                status={
                                    project.status
                                }
                                progress={
                                    progressByProject[
                                        project.id
                                    ] ?? 0
                                }
                                onClick={() =>
                                    onProjectClick(
                                        project,
                                    )
                                }
                                onEdit={() =>
                                    onEdit(
                                        project,
                                    )
                                }
                                onDelete={() =>
                                    onDelete(
                                        project,
                                    )
                                }
                            />
                        ),
                    )}
                </div>
            )}
        </section>
    );
}