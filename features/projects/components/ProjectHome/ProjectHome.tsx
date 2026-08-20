"use client";

import { useState } from "react";

import type { Project } from "@/features/projects/types";
import ProjectDashboard from "@/features/projects/components/ProjectDashboard";
import ProjectLeftPanel from "@/features/projects/components/ProjectLeftPanel";
import ProjectCreateForm from "@/features/projects/components/ProjectCreateForm";
import ProjectEditForm from "@/features/projects/components/ProjectEditForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";


type Props = {
    projects: Project[];

    progressByProject: Record<
        string,
        number
    >;
};

export default function ProjectHome({
    projects,
    progressByProject,
}: Props) {
    const router = useRouter();
    const [editingProject, setEditingProject] =
        useState<Project | null>(null);

    const [deletingProject, setDeletingProject] =
        useState<Project | null>(null);

    const [isDeleting, setIsDeleting] =
        useState(false);

    async function handleDeleteProject() {
        if (!deletingProject || isDeleting) {
            return;
        }

        try {
            setIsDeleting(true);

            const response = await fetch(
                `/api/projects/${deletingProject.id}`,
                {
                    method: "DELETE",
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data?.error ?? "Delete failed.",
                );
            }

            setDeletingProject(null);

            toast.success(
                "Project deleted successfully.",
            );

            router.refresh();
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "PROJECT_HAS_STATIONS"
            ) {
                toast.error(
                    "Project cannot be deleted because it contains stations.",
                );
            } else if (
                error instanceof Error &&
                error.message === "Project not found."
            ) {
                toast.error("Project not found.");
            } else {
                toast.error("Failed to delete project.");
            }
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <>
            <ProjectDashboard
                left={
                    <ProjectLeftPanel
                        projects={projects}
                        progressByProject={progressByProject}
                        onEdit={(project) => {
                            setEditingProject(project);
                        }}
                        onDelete={(project) => {
                            setDeletingProject(project);
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

            <ConfirmDialog
                open={deletingProject !== null}
                title="Delete Project"
                message={
                    deletingProject
                        ? `Are you sure you want to delete project "${deletingProject.code}"? This action cannot be undone.`
                        : ""
                }
                confirmText={
                    isDeleting
                        ? "Deleting..."
                        : "Delete"
                }
                cancelText="Cancel"
                onConfirm={handleDeleteProject}
                onCancel={() => {
                    if (!isDeleting) {
                        setDeletingProject(null);
                    }
                }}
            />
        </>
    );
}
