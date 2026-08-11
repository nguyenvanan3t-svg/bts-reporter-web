"use client";

import { useState } from "react";

import type { Project } from "@/features/projects/types";
import ProjectDashboard from "@/features/projects/components/ProjectDashboard";
import ProjectLeftPanel from "@/features/projects/components/ProjectLeftPanel";
import ProjectCreateForm from "@/features/projects/components/ProjectCreateForm";
import ProjectEditForm from "@/features/projects/components/ProjectEditForm";


type Props = {
    projects: Project[];
};

export default function ProjectHome({
    projects,
}: Props) {
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    return (
        <ProjectDashboard
            left={
                <ProjectLeftPanel
                    projects={projects}
                    onEdit={(project) => {
                        setEditingProject(project);
                    }}
                />
            }
            right={
                editingProject ? (
                    <ProjectEditForm
                        project={editingProject}
                        onCancel={() => {
                            setEditingProject(null);
                        }}
                        onSaved={() => {
                            setEditingProject(null);
                        }}
                    />
                ) : (
                    <ProjectCreateForm />
                )
            }
        />
    );
}