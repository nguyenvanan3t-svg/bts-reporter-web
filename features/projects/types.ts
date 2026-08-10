export interface Project {
  id: string;

  code: string;

  name: string;

  customer: string | null;

  year: number;

  description: string | null;

  status: ProjectStatus;

  created_at: string;

  updated_at: string;
}

export type ProjectStatus =
    "PLANNING"
    | "ACTIVE"
    | "ARCHIVED";

export interface CreateProjectDto {
  code: string;

  name: string;

  customer?: string;

  year: number;

  description?: string;
}

export interface UpdateProjectDto {
    code: string;
    name: string;
    customer: string;
    year: number;
    status: ProjectStatus;
    description: string;
}

export interface ProjectSearchResult {
    projectId: string;

    projectCode: string;

    projectName: string;

    customer: string;

    year: number;

    stationCode: string;

    stationAddress: string;
}