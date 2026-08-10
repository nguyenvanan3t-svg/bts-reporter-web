import { NextResponse } from "next/server";
import { removeFromProject } from "@/features/stations/service";

export async function POST(
    request: Request,
) {

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