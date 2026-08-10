import { Project } from "../types";
import Link from "next/link";

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  return (
    <table
      border={1}
      cellPadding={8}
      style={{
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Customer</th>
          <th>Year</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
              <td>{project.code}</td>
              <td>{project.name}</td>
              <td>{project.customer}</td>
              <td>{project.year}</td>
              <td>{project.status}</td>

              <td>
                  <Link href={`/projects/${project.id}`}>
                    Edit
                  </Link>
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}