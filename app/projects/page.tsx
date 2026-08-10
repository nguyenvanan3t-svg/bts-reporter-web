import { ProjectTable } from "@/features/projects/components/ProjectTable";
import { projectService } from "@/services/container";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import ProjectDashboard from "@/features/projects/components/ProjectDashboard";
import ProjectLeftPanel from "@/features/projects/components/ProjectLeftPanel";
import ProjectCreateForm from "@/features/projects/components/ProjectCreateForm";
import ProjectSearch from "@/features/projects/components/ProjectSearch";
import ProjectDashboardHeader from "@/features/projects/components/ProjectDashboardHeader";

export default async function ProjectsPage() {
  const projects = await projectService.getAll();

  return (
    <div
        style={{
            position: "relative",
            overflow: "hidden",
        }}
    >
        <ProjectDashboardHeader />

        <ProjectSearch />

        <ProjectDashboard
            left={
                <ProjectLeftPanel
                    projects={projects}
                />
            }
            right={<ProjectCreateForm />}
        />
    </div>
  );
}