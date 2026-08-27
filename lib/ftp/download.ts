import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
    ZipArchive,
} from "archiver";

import {
    Client,
    FileType,
} from "basic-ftp";

import { connectFtp } from "./client";
import type { FtpResourceType } from "./types";

export type FtpDownloadResource =
    | "dpn"
    | "survey"
    | "word"
    | "visio"
    | "pdf";

type DownloadInput = {
    resource: FtpDownloadResource;
    resourceType: FtpResourceType;
    ftpPath: string;
    fileName?: string;
};

export type FtpDownloadResult = {
    filePath: string;
    fileName: string;
    contentType: string;
};

function getContentType(
    fileName: string,
): string {
    const extension =
        path.extname(fileName).toLowerCase();

    switch (extension) {
        case ".pdf":
            return "application/pdf";

        case ".doc":
            return "application/msword";

        case ".docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        case ".vsd":
        case ".vsdx":
            return "application/vnd.visio";

        case ".zip":
            return "application/zip";

        default:
            return "application/octet-stream";
    }
}

async function downloadFile(
    client: Client,
    ftpPath: string,
    outputPath: string,
): Promise<void> {
    await client.downloadTo(
        outputPath,
        ftpPath,
    );
}

async function addFtpFolderToArchive(
    client: Client,
    archive: ZipArchive,
    ftpFolder: string,
    archiveFolder: string,
    tempFiles: string[],
): Promise<void> {
    const items =
        await client.list(ftpFolder);

    for (const item of items) {
        const itemPath =
            `${ftpFolder}/${item.name}`;

        const archivePath =
            `${archiveFolder}/${item.name}`;

        if (
            item.type ===
            FileType.Directory
        ) {
            await addFtpFolderToArchive(
                client,
                archive,
                itemPath,
                archivePath,
                tempFiles,
            );

            continue;
        }

        const tempFile =
            path.join(
                os.tmpdir(),
                `bts-ftp-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2)}-${item.name}`,
            );

        await downloadFile(
            client,
            itemPath,
            tempFile,
        );

        tempFiles.push(tempFile);

        archive.file(
            tempFile,
            {
                name: archivePath,
            },
        );
    }
}

async function createFolderZip(
    client: Client,
    ftpPath: string,
    outputPath: string,
    rootName: string,
): Promise<void> {
    const output =
        fs.createWriteStream(
            outputPath,
        );

    const archive =
        new ZipArchive({
            zlib: {
                level: 6,
            },
        });

    const tempFiles: string[] = [];

    const archiveFinished =
        new Promise<void>(
            (resolve, reject) => {
                output.once(
                    "close",
                    resolve,
                );

                output.once(
                    "error",
                    reject,
                );

                archive.once(
                    "error",
                    reject,
                );
            },
        );

    archive.pipe(output);

    try {
        await addFtpFolderToArchive(
            client,
            archive,
            ftpPath,
            rootName,
            tempFiles,
        );

        await archive.finalize();

        await archiveFinished;
    } finally {
        await Promise.all(
            tempFiles.map(
                (file) =>
                    fs.promises.rm(
                        file,
                        {
                            force: true,
                        },
                    ),
            ),
        );
    }
}

export async function downloadFtpResource(
    input: DownloadInput,
): Promise<FtpDownloadResult> {
    const client =
        await connectFtp();

    const tempDirectory =
        await fs.promises.mkdtemp(
            path.join(
                os.tmpdir(),
                "bts-ftp-download-",
            ),
        );

    try {
        if (
            input.resourceType ===
            "file"
        ) {
            const fileName =
                input.fileName ??
                path.basename(
                    input.ftpPath,
                );

            const outputPath =
                path.join(
                    tempDirectory,
                    fileName,
                );

            await downloadFile(
                client,
                input.ftpPath,
                outputPath,
            );

            return {
                filePath: outputPath,
                fileName,
                contentType:
                    getContentType(
                        fileName,
                    ),
            };
        }

        const folderName =
            path.basename(
                input.ftpPath,
            );

        const fileName =
            `${folderName}.zip`;

        const outputPath =
            path.join(
                tempDirectory,
                fileName,
            );

        await createFolderZip(
            client,
            input.ftpPath,
            outputPath,
            folderName,
        );

        return {
            filePath: outputPath,
            fileName,
            contentType:
                "application/zip",
        };
    } finally {
        client.close();
    }
}