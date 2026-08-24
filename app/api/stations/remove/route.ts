import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { removeFromProject } from "@/features/stations/service";

export async function POST(
    request: Request,
) {
    const auth =
        await requireAuth();

    if (!auth.authenticated) {
        return auth.response;
    }

    try {

        const body = await request.json();

        await removeFromProject(
            body.stationId,
        );

        return NextResponse.json({
            success: true,
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
            },
            {
                status: 500,
            },
        );

    }

}