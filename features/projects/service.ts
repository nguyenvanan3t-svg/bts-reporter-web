import { ProjectRepository } from "./repository";
import { hasStationsByProject } from "@/features/stations/repository";
import type {
    CreateProjectDto,
    UpdateProjectDto,
} from "./types";

export class ProjectService {
    constructor(
        private readonly repository: ProjectRepository
    ) {}

    async getAll() {
        return this.repository.getAll();
    }

    async create(dto: CreateProjectDto) {
        const existing = await this.repository.findByCode(dto.code);

        if (existing) {
        throw new Error("PROJECT_CODE_EXISTS");
        }

        const existedName =
            await this.repository.findByName(dto.name);

        if (existedName) {
            throw new Error("PROJECT_NAME_EXISTS");
        }

        return this.repository.create(dto);
    }

    async getById(id: string) {
        return this.repository.findById(id);
    }

    async update(id: string, dto: UpdateProjectDto) {
        const project = await this.repository.findById(id);

        if (!project) {
            throw new Error("Project not found.");
        }

        if (project.status === "ARCHIVED") {
            throw new Error("Archived projects cannot be modified.");
        }

        const existing = await this.repository.findByCode(dto.code);

        if (existing && existing.id !== id) {
            throw new Error("PROJECT_CODE_EXISTS");
        }

        return this.repository.update(id, dto);
    }

    async archive(id: string) {
        return this.repository.archive(id);
    }
    async delete(id: string) {
        const project = await this.repository.findById(id);

        if (!project) {
            throw new Error("Project not found.");
        }

        const hasStations = await hasStationsByProject(id);

        if (hasStations) {
            throw new Error("PROJECT_HAS_STATIONS");
        }

        return this.repository.delete(id);
    }
}
