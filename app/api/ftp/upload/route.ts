import { NextResponse } from "next/server";

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
    uploadFtpResource,
    type FtpUploadResource,
} from "@/lib/ftp/upload";

const projectRepository =
    new ProjectRepository();

const allowedResources =
    new Set<FtpUploadResource>([
        "survey",
        "word",
        "visio",
        "pdf",
    ]);

export const runtime = "nodejs";

export async function POST(
    request: Request,
) {
    try {
        const formData =
            await request.formData();

        const projectId =
            formData.get(
                "projectId",
            );

        const stationCode =
            formData.get(
                "stationCode",
            );

        const resource =
            formData.get(
                "resource",
            );

        const file =
            formData.get("file");

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
                resource as FtpUploadResource,
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

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "File is required.",
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
                        `Station ${stationCode.trim()} not found in project.`,
                },
                { status: 404 },
            );
        }

        const stationCodeValue =
            stationCode.trim();

        const resources =
            await loadFtpResources(
                station.id,
            );

        const ftpResource =
            resources[
                resource as FtpUploadResource
            ];

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
                        `${resource} is not available for station ${stationCodeValue}.`,
                },
                { status: 404 },
            );
        }

        if (
            ftpResource.type !==
            "file"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "This resource is a folder and cannot be replaced by file upload.",
                },
                { status: 400 },
            );
        }

        if (
            !ftpResource.fileName
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        "Existing FTP file name could not be determined.",
                },
                { status: 500 },
            );
        }

        /*
         * The uploaded file must keep
         * the original FTP file name.
         */

        const result =
            await uploadFtpResource({
                resource:
                    resource as FtpUploadResource,
                resourceType:
                    ftpResource.type,
                ftpPath:
                    ftpResource.path,
                fileName:
                    ftpResource.fileName,
                file,
            });

        return NextResponse.json({
            success: true,
            data: {
                stationCode:
                    stationCodeValue,
                resource,
                fileName:
                    result.fileName,
                path:
                    result.path,
                size:
                    result.size,
            },
        });
    } catch (error) {
        console.error(
            "FTP upload failed:",
            error,
        );

        return NextResponse.json(
            {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown FTP upload error.",
            },
            { status: 500 },
        );
    }
}