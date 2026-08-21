import { projectService } from "@/services/container";
import ProjectSearch from "@/features/projects/components/ProjectSearch";
import ProjectDashboardHeader from "@/features/projects/components/ProjectDashboardHeader";
import ProjectHome from "@/features/projects/components/ProjectHome";
import {
    loadProjectsPdfProgress,
} from "@/features/stations/service";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    const projects =
        await projectService.getAll();

    const progressByProject =
        await loadProjectsPdfProgress(
            projects.map(
                (project) => project.id,
            ),
        );

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "#F8FAFC",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 1380,
                    margin: "0 auto",
                    padding:
                        "20px 32px 48px",
                    boxSizing: "border-box",
                }}
            >
                <ProjectDashboardHeader
                    totalProjects={projects.length}
                />

                <ProjectSearch />

                <ProjectHome
                    projects={projects}
                    progressByProject={
                        progressByProject
                    }
                />
            </div>
        </main>
    );
}
