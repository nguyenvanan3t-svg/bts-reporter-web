import { Project } from "./types";

export function mapProject(data: Project): Project {
  return {
    ...data,
  };
}