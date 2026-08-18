import { NextResponse } from "next/server";

import { ProjectRepository } from "@/features/projects/repository";
import {
    getByProjectAndCode,
} from "@/features/stations/service";
import { scanStationFtp } from "@/lib/ftp/scanner";

const projectRepository =
    new ProjectRepository();

export async function POST(
    request: Request,
) {
    try {
        const body =
            await request.json();

        const projectId =
            body.projectId;

        const stationCode =
            body.stationCode;

        if (
            typeof projectId !== "string" ||
            !projectId.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "projectId is required.",
                },
                { status: 400 },
            );
        }

        if (
            typeof stationCode !== "string" ||
            !stationCode.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "stationCode is required.",
                },
                { status: 400 },
            );
        }

        const project =
            await projectRepository.findById(
                projectId,
            );

        if (!project) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Project not found.",
                },
                { status: 404 },
            );
        }

        const stationRecord =
            await getByProjectAndCode(
                projectId,
                stationCode.trim(),
            );

        if (!stationRecord) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Station not found in project.",
                },
                { status: 404 },
            );
        }

        const station =
            await scanStationFtp(
                projectId,
                project.name,
                stationRecord.id,
                stationCode.trim(),
            );

        return NextResponse.json({
            success: true,
            data: station,
        });
    } catch (error) {
        console.error(
            "FTP station scan failed:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown FTP station scan error.",
            },
            { status: 500 },
        );
    }
}