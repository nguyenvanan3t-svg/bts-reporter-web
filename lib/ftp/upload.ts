import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { Client } from "basic-ftp";

import { connectFtp } from "./client";
import type { FtpResourceType } from "./types";

export type FtpUploadResource =
    | "survey"
    | "word"
    | "visio"
    | "pdf";

type UploadInput = {
    resource: FtpUploadResource;
    resourceType: FtpResourceType;
    ftpPath: string;
    fileName: string;
    file: File;
};

export type FtpUploadResult = {
    fileName: string;
    path: string;
    size: number;
};

export async function uploadFtpResource(
    input: UploadInput,
): Promise<FtpUploadResult> {
    const client: Client =
        await connectFtp();

    const tempDirectory =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "bts-ftp-upload-",
            ),
        );

    const tempFile =
        path.join(
            tempDirectory,
            input.fileName,
        );

    try {
        if (
            input.resourceType !==
            "file"
        ) {
            throw new Error(
                "Only file resources can be uploaded.",
            );
        }

        const buffer =
            Buffer.from(
                await input.file.arrayBuffer(),
            );

        await fs.promises.writeFile(
            tempFile,
            buffer,
        );

        const connectStart = Date.now();

        const client: Client =
            await connectFtp();

        console.log(
            "[FTP Upload] connectFtp:",
            Date.now() - connectStart,
            "ms",
        );

        const uploadStart = Date.now();

        await client.uploadFrom(
            tempFile,
            input.ftpPath,
        );

        console.log(
            "[FTP Upload] uploadFrom:",
            Date.now() - uploadStart,
            "ms",
        );

        return {
            fileName:
                input.fileName,
            path:
                input.ftpPath,
            size:
                buffer.length,
        };
    } finally {
        client.close();

        await fs.promises.rm(
            tempDirectory,
            {
                recursive: true,
                force: true,
            },
        );
    }
}