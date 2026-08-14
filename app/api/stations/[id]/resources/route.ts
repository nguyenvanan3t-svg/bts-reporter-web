import { NextResponse } from "next/server";

import { loadFtpResources } from "@/features/stations/service";

export async function GET(
    _request: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    },
) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Station id is required.",
                },
                { status: 400 },
            );
        }

        const resources =
            await loadFtpResources(id);

        return NextResponse.json({
            success: true,
            data: resources,
        });
    } catch (error) {
        console.error(
            "Failed to load station FTP resources:",
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