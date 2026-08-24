import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";

import { projectService } from "@/services/container";

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const auth = await requireAuth();

  if (!auth.authenticated) {
    return auth.response;
  }

  try {
    const { id } = await context.params;

    const body = await request.json();

    const project = await projectService.update(
      id,
      body
    );

    return NextResponse.json(project);
  } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Update failed.",
            },
            {
                status: 400,
            }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    const auth = await requireAuth();

    if (!auth.authenticated) {
        return auth.response;
    }

    try {
        const { id } = await context.params;

        await projectService.delete(id);

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Delete failed.",
            },
            {
                status: 400,
            }
        );
    }
}
