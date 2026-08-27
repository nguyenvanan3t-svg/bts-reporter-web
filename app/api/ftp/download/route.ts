import fs from "node:fs";
import { Readable } from "node:stream";

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";

import {
    ProjectRepository,
} from "@/features/projects/repository";

import {
    loadFtpResources,
} from "@/features/stations/service";

import {
    getStationByProjectAndCode,
} from "@/features/stations/repository";

import {
    downloadFtpResource,
    type FtpDownloadResource,
} from "@/lib/ftp/download";

const projectRepository =
    new ProjectRepository();

const allowedResources =
    new Set<FtpDownloadResource>([
        "dpn",
        "survey",
        "word",
        "visio",
        "pdf",
    ]);

export const runtime = "nodejs";

export async function POST(
    request: Request,
) {
    const auth =
        await requireAuth();

    if (!auth.authenticated) {
        return auth.response;
    }

    try {
        const body =
            await request.json();

        const projectId =
            body.projectId;

        const stationCode =
            body.stationCode;

        const resource =
            body.resource;

        if (
            typeof projectId !==
                "string" ||
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
            typeof stationCode !==
                "string" ||
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

        if (
            typeof resource !==
                "string" ||
            !allowedResources.has(
                resource as FtpDownloadResource,
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Invalid resource.",
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

        const station =
            await getStationByProjectAndCode(
                projectId,
                stationCode.trim(),
            );

        if (!station) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        `Station ${stationCode} not found in project.`,
                },
                { status: 404 },
            );
        }

        let ftpPath: string;
        let ftpResourceType: "file" | "folder";
        let ftpFileName: string | undefined;

        if (resource === "dpn") {

            if (!station.hasDpn) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            `DPN is not available for station ${stationCode}.`,
                    },
                    { status: 404 },
                );
            }

            ftpPath =
                `/Projects/${project.name}/Ho so/Logfile/${station.code}`;

            ftpResourceType = "folder";
            ftpFileName = undefined;

        } else {

            const resources =
                await loadFtpResources(
                    station.id,
                );

            const documentResource =
                resource as
                    | "survey"
                    | "word"
                    | "visio"
                    | "pdf";

            const ftpResource =
                resources[documentResource];

            if (
                ftpResource.status !==
                    "FOUND" ||
                !ftpResource.path ||
                !ftpResource.type
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        error:
                            `${resource} is not available for station ${stationCode}.`,
                    },
                    { status: 404 },
                );
            }

            ftpPath =
                ftpResource.path;

            ftpResourceType =
                ftpResource.type;

            ftpFileName =
                ftpResource.fileName;
        }

        const download =
            await downloadFtpResource({
                resource:
                    resource as FtpDownloadResource,
                resourceType:
                    ftpResourceType,
                ftpPath,
                fileName:
                    ftpFileName,
            });

        const fileStream =
            fs.createReadStream(
                download.filePath,
            );

        const webStream =
            Readable.toWeb(
                fileStream,
            ) as ReadableStream;

        return new NextResponse(
            webStream,
            {
                status: 200,
                headers: {
                    "Content-Type":
                        download.contentType,

                    "Content-Disposition":
                        `attachment; filename*=UTF-8''${encodeURIComponent(
                            download.fileName,
                        )}`,
                },
            },
        );
    } catch (error) {
        console.error(
            "FTP download failed:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown FTP download error.",
            },
            { status: 500 },
        );
    }
}