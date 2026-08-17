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
    const routeStart = Date.now();
    try {
        const bodyStart = Date.now();

        const body =
            await request.json();

        console.log(
            "[FTP API] request.json:",
            Date.now() - bodyStart,
            "ms",
        );

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

        const projectStart = Date.now();

        const project =
            await projectRepository.findById(
                projectId,
            );

        console.log(
            "[FTP API] findProject:",
            Date.now() - projectStart,
            "ms",
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

        const stationsStart = Date.now();

        const stations =
            await loadStations(
                projectId,
            );

        console.log(
            "[FTP API] loadStations:",
            Date.now() - stationsStart,
            "ms",
            `(${stations.length} stations)`,
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

        const scanRunInsertStart = Date.now();

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

        console.log(
            "[FTP API] insert scanRun:",
            Date.now() - scanRunInsertStart,
            "ms",
        );
        
        if (scanRunError) {
            throw scanRunError;
        }

        scanRunId = scanRun.id;

        console.log(
            "[FTP API] before scanProjectFtp:",
            Date.now() - routeStart,
            "ms",
        );

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