import { NextResponse } from "next/server";

import { ProjectRepository } from "@/features/projects/repository";
import { loadStations } from "@/features/stations/service";
import { scanProjectFtp } from "@/lib/ftp/scanner";
import { supabase } from "@/lib/supabase";
import {
    cleanupOldProjectFtpScans,
} from "@/features/stations/repository";

const projectRepository =
    new ProjectRepository();

export async function POST(
    request: Request,
) {
    let scanRunId: string | null = null;
    try {
        const body =
            await request.json();

        const projectId =
            body.projectId;

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

        const stations =
            await loadStations(
                projectId,
            );

        if (stations.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Project has no stations.",
                },
                { status: 400 },
            );
        }

        const startedAt =
            new Date().toISOString();

        const {
            data: scanRun,
            error: scanRunError,
        } = await supabase
            .from("ftp_scan_runs")
            .insert({
                project_id: projectId,
                started_at: startedAt,
                status: "RUNNING",
            })
            .select("id")
            .single();
        
        if (scanRunError) {
            throw scanRunError;
        }

        scanRunId = scanRun.id;

        const result =
            await scanProjectFtp(
                project.name,
                stations.map(
                    (station) => ({
                        id: station.id,
                        code: station.code,
                    }),
                ),
            );

        const totalStations =
            result.stations.length;

        const surveyFound =
            result.stations.filter(
                (station) =>
                    station.survey.status ===
                    "FOUND",
            ).length;

        const wordFound =
            result.stations.filter(
                (station) =>
                    station.word.status ===
                    "FOUND",
            ).length;

        const visioFound =
            result.stations.filter(
                (station) =>
                    station.visio.status ===
                    "FOUND",
            ).length;

        const pdfFound =
            result.stations.filter(
                (station) =>
                    station.pdf.status ===
                    "FOUND",
            ).length;

        const completedAt =
            new Date().toISOString();

        const {
            error: completeError,
        } = await supabase
            .from("ftp_scan_runs")
            .update({
                completed_at:
                    completedAt,
                status: "COMPLETED",

                total_stations:
                    totalStations,
                survey_found:
                    surveyFound,
                word_found:
                    wordFound,
                visio_found:
                    visioFound,
                pdf_found:
                    pdfFound,
            })
            .eq("id", scanRun.id);

        if (completeError) {
            throw completeError;
        }

        await cleanupOldProjectFtpScans(
            projectId,
        );

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        if (scanRunId) {
            await supabase
                .from("ftp_scan_runs")
                .update({
                    completed_at:
                        new Date().toISOString(),
                    status: "FAILED",
                    error_message:
                        error instanceof Error
                            ? error.message
                            : "Unknown FTP scan error.",
                })
                .eq("id", scanRunId);
        }
        
        console.error(
            "FTP project scan failed:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown FTP scan error.",
            },
            { status: 500 },
        );
    }
}