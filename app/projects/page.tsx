import { projectService } from "@/services/container";
import ProjectSearch from "@/features/projects/components/ProjectSearch";
import ProjectDashboardHeader from "@/features/projects/components/ProjectDashboardHeader";
import ProjectHome from "@/features/projects/components/ProjectHome";

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

        <ProjectHome projects={projects} />
    </div>
  );
}