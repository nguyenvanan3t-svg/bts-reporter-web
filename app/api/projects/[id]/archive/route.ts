import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { projectService } from "@/services/container";

export async function PUT(
    request: Request,
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

        const project = await projectService.archive(id);

        return NextResponse.json(project);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Archive project failed.",
            },
            {
                status: 500,
            }
        );
    }
}