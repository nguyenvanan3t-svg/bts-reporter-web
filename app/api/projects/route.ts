import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";

import { projectService } from "@/services/container";

export async function GET() {
  const auth = await requireAuth();

  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const projects = await projectService.getAll();

    return NextResponse.json(projects);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PROJECT_CODE_EXISTS"
    ) {
      return NextResponse.json(
        { message: "Project code already exists." },
        { status: 400 }
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();

  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const body = await request.json();

    const project = await projectService.create(body);

    return NextResponse.json(project, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}