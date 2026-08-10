import { ProjectRepository } from "@/features/projects/repository";
import { ProjectService } from "@/features/projects/service";

const projectRepository = new ProjectRepository();

export const projectService = new ProjectService(
  projectRepository
);
