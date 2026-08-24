import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";

import {
    loadProjectFtpResources,
    loadLatestProjectFtpScan,
    loadProjectFtpScanHistory,
} from "@/features/stations/service";

export async function GET(
    _request: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    const auth = await requireAuth();

    if (!auth.authenticated) {
        return auth.response;
    }

    try {
        const { id } =
            await context.params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Project id is required.",
                },
                { status: 400 },
            );
        }

        const [
            resources,
            lastScan,
            history,
        ] = await Promise.all([
            loadProjectFtpResources(id),
            loadLatestProjectFtpScan(id),
            loadProjectFtpScanHistory(id),
        ]);

        return NextResponse.json({
            success: true,
            data: resources,
            lastScan,
            history,
        });

    } catch (error) {

        console.error(
            "Failed to load project FTP resources:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown error.",
            },
            { status: 500 },
        );
    }
}