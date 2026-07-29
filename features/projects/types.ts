import { BaseEntity } from "@/types/common";

export type ProjectStatus = "PLANNING" | "ACTIVE" | "ARCHIVED";

export interface Project extends BaseEntity {
  code: string;
  name: string;
  customer: string | null;
  year: number;
  description: string | null;
  status: ProjectStatus;
}

export interface CreateProjectDto {
  code: string;
  name: string;
  customer?: string;
  year: number;
  description?: string;
}

export interface UpdateProjectDto {
  name: string;
  customer?: string;
  year: number;
  description?: string;
}