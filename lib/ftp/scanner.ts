import { FileType } from "basic-ftp";
import { Writable } from "node:stream";

import { connectFtp } from "@/lib/ftp/client";
import {
    getFtpExcelSources,
    upsertFtpExcelSources,
    upsertStationsFtpResources,
    updateStationsFromExcel,
} from "@/features/stations/repository";

import type {
    FtpResource,
    ProjectFtpScanResult,
    StationFtpScanResult,
} from "@/lib/ftp/types";
import {
    parseExcelStationFile,
} from "./excelScanner";

type ScanStationInput = {
    id: string;
    code: string;
};

type ExcelStationScanResult = {
    stationCode: string;
    fileName: string;
    address: string;
};

type FtpListItem = {
    name: string;
    type: FileType;
    size: number;
    modifiedAt?: Date;
};

type ExcelFtpFile = {
    path: string;
    fileName: string;
    size: number;
    modifiedAt?: Date;
};

function normalizeStationFolderName(
    folderName: string,
): string {
    const match = folderName.match(
        /^\d+\s*-\s*(.+)$/,
    );

    if (match) {
        return match[1].trim();
    }

    return folderName.trim();
}

function getSurveyStationCode(
    fileName: string,
): string | null {

    if (
        !fileName
            .toLowerCase()
            .endsWith(".zip")
    ) {
        return null;
    }

    const baseName = fileName.slice(
        0,
        -4,
    );

    const separatorIndex =
        baseName.lastIndexOf("_");

    if (separatorIndex === -1) {
        return baseName.trim();
    }

    return baseName
        .slice(separatorIndex + 1)
        .trim();
}

function createMissingResource(): FtpResource {
    return {
        status: "MISSING",
    };
}

function createFoundResource(
    item: FtpListItem,
    path: string,
): FtpResource {
    return {
        status: "FOUND",
        type:
            item.type === FileType.Directory
                ? "folder"
                : "file",
        fileName:
            item.type === FileType.File
                ? item.name
                : undefined,
        path,
        size:
            item.type === FileType.File
                ? item.size
                : undefined,
        modifiedAt:
            item.modifiedAt?.toISOString(),
    };
}

function createInitialStationResult(
    stationCode: string,
): StationFtpScanResult {
    return {
        stationCode,
        survey: createMissingResource(),
        word: createMissingResource(),
        visio: createMissingResource(),
        pdf: createMissingResource(),
    };
}

function getResourceInfo(
    fileName: string,
): {
    stationCode: string;
    resourceType: "word" | "visio" | "pdf";
} | null {

    const match =
        fileName.match(
            /_\(([^()]+)\)\.(docx|vsdx|pdf)$/i,
        );

    if (!match) {
        return null;
    }

    const extension =
        match[2].toLowerCase();

    let resourceType:
        | "word"
        | "visio"
        | "pdf";

    if (extension === "docx") {
        resourceType = "word";
    } else if (extension === "vsdx") {
        resourceType = "visio";
    } else {
        resourceType = "pdf";
    }

    return {
        stationCode:
            match[1].trim(),
        resourceType,
    };
}

async function scanSurvey(
    client: Awaited<ReturnType<typeof connectFtp>>,
    projectPath: string,
    projectItems: FtpListItem[],
    stationResults: Map<string, StationFtpScanResult>,
) {
    let surveyListCount = 0;
    const stationByCode =
        new Map<string, StationFtpScanResult>();

    for (
        const [stationCode, result]
        of stationResults
    ) {
        stationByCode.set(
            stationCode.toUpperCase(),
            result,
        );
    }
    const provinceFolders = projectItems.filter(
        (item) =>
            item.type === FileType.Directory &&
            item.name !== "Ho so" &&
            item.name !== "0. Du lieu",
    );

    for (const province of provinceFolders) {
        const provincePath =
            `${projectPath}/${province.name}`;

        const provinceListStart = Date.now();

        const provinceItems =
            await client.list(provincePath);

        console.log(
            "[FTP Survey List]",
            ++surveyListCount,
            "province",
            province.name,
            Date.now() - provinceListStart,
            "ms",
        );

        for (const item of provinceItems) {
            /*
            * Trường hợp Survey Package dạng ZIP:
            *
            * Province/
            * └── DNG0004-11.zip
            *
            * hoặc:
            *
            * Province/
            * └── NguyenVanA_DNG0004-11.zip
            */
            if (item.type === FileType.File) {

                const stationCode =
                    getSurveyStationCode(
                        item.name,
                    );

                if (stationCode) {

                    const result =
                        stationByCode.get(
                            stationCode.toUpperCase(),
                        );

                    if (result) {
                        result.survey =
                            createFoundResource(
                                item,
                                `${provincePath}/${item.name}`,
                            );
                    }
                }

                continue;
            }

            if (item.type !== FileType.Directory) {
                continue;
            }

            const stationCode =
                normalizeStationFolderName(
                    item.name,
                );

            if (stationResults.has(stationCode)) {
                const result =
                    stationResults.get(
                        stationCode,
                    )!;

                result.survey = {
                    status: "FOUND",
                    type: "folder",
                    path:
                        `${provincePath}/${item.name}`,
                };

                continue;
            }

            const intermediatePath =
                `${provincePath}/${item.name}`;

            const intermediateListStart = Date.now();

            const intermediateItems =
                await client.list(
                    intermediatePath,
                );

            console.log(
                "[FTP Survey List]",
                ++surveyListCount,
                "intermediate",
                item.name,
                Date.now() - intermediateListStart,
                "ms",
            );

            for (const stationFolder of intermediateItems) {
                /*
                * Survey ZIP nằm trong tầng Lan/Dot:
                *
                * Province/
                * └── Dot1/
                *     └── DNG0004-11.zip
                */
                if (
                    stationFolder.type ===
                    FileType.File
                ) {

                    const stationCode =
                        getSurveyStationCode(
                            stationFolder.name,
                        );

                    if (stationCode) {

                        const result =
                            stationByCode.get(
                                stationCode.toUpperCase(),
                            );

                        if (result) {
                            result.survey =
                                createFoundResource(
                                    stationFolder,
                                    `${intermediatePath}/${stationFolder.name}`,
                                );
                        }
                    }

                    continue;
                }

                if (
                    stationFolder.type !==
                    FileType.Directory
                ) {
                    continue;
                }

                const nestedStationCode =
                    normalizeStationFolderName(
                        stationFolder.name,
                    );

                if (
                    !stationResults.has(
                        nestedStationCode,
                    )
                ) {
                    continue;
                }

                const result =
                    stationResults.get(
                        nestedStationCode,
                    )!;

                result.survey = {
                    status: "FOUND",
                    type: "folder",
                    path:
                        `${intermediatePath}/${stationFolder.name}`,
                };
            }
        }
    }
}

async function scanDocuments(
    client: Awaited<ReturnType<typeof connectFtp>>,
    hoSoPath: string,
    stationResults: Map<string, StationFtpScanResult>,
): Promise<ExcelFtpFile[]> {
    const stationByCode =
        new Map<
            string,
            StationFtpScanResult
        >();

    for (
        const [stationCode, result]
        of stationResults
    ) {
        stationByCode.set(
            stationCode.toUpperCase(),
            result,
        );
    }

    const excelFiles: ExcelFtpFile[] = [];

    async function scanFolder(
        folderPath: string,
    ): Promise<void> {
        const items =
            await client.list(
                folderPath,
            );

        for (const item of items) {
            const itemPath =
                `${folderPath}/${item.name}`;

            if (
                item.type ===
                FileType.Directory
            ) {
                await scanFolder(
                    itemPath,
                );

                continue;
            }

            if (
                item.type !==
                FileType.File
            ) {
                continue;
            }

            const lowerName =
                item.name.toLowerCase();

            if (
                lowerName.endsWith(".xlsx") ||
                lowerName.endsWith(".xlsm")
            ) {
                excelFiles.push({
                    path: itemPath,
                    fileName: item.name,
                    size: item.size,
                    modifiedAt: item.modifiedAt,
                });

                continue;
            }

            const resourceInfo =
                getResourceInfo(
                    item.name,
                );

            if (!resourceInfo) {
                continue;
            }

            const result =
                stationByCode.get(
                    resourceInfo.stationCode.toUpperCase(),
                );

            if (!result) {
                continue;
            }

            result[resourceInfo.resourceType] =
                createFoundResource(
                    item,
                    itemPath,
                );
        }
    }

    await scanFolder(
        hoSoPath,
    );

    return excelFiles;
}

async function scanExcelSources(
    _client: Awaited<ReturnType<typeof connectFtp>>,
    excelFiles: ExcelFtpFile[],
    stationCodes: string[],
): Promise<{
    results: ExcelStationScanResult[];
    processedFiles: ExcelFtpFile[];
}> {
    const results: ExcelStationScanResult[] =
        [];

    const processedFiles: ExcelFtpFile[] =
        [];

    const concurrency = 4;

    let nextIndex = 0;

    async function worker(): Promise<void> {
        const client =
            await connectFtp();

        try {
            while (true) {
                const index =
                    nextIndex++;

                if (
                    index >=
                    excelFiles.length
                ) {
                    return;
                }

                const excelFile =
                    excelFiles[index];

                const filePath =
                    excelFile.path;

                const fileName =
                    excelFile.fileName;

                try {
                    const chunks: Buffer[] =
                        [];

                    const writable =
                        new Writable({
                            write(
                                chunk,
                                _encoding,
                                callback,
                            ) {
                                chunks.push(
                                    Buffer.from(
                                        chunk,
                                    ),
                                );

                                callback();
                            },
                        });

                    const downloadStart =
                        Date.now();

                    await client.downloadTo(
                        writable,
                        filePath,
                    );

                    const downloadMs =
                        Date.now() -
                        downloadStart;

                    const buffer =
                        Buffer.concat(
                            chunks,
                        );

                    const parseStart =
                        Date.now();

                    const matches =
                        parseExcelStationFile(
                            buffer,
                            fileName,
                            stationCodes,
                        );

                    const parseMs =
                        Date.now() -
                        parseStart;

                    console.log(
                        "[FTP Excel File]",
                        fileName,
                        "download",
                        downloadMs,
                        "ms",
                        "parse",
                        parseMs,
                        "ms",
                        "size",
                        buffer.length,
                        "bytes",
                        "results",
                        matches.length,
                    );

                    results.push(
                        ...matches,
                    );

                    processedFiles.push(
                        excelFile,
                    );
                } catch (error) {
                    console.error(
                        `Failed to scan Excel file ${filePath}:`,
                        error,
                    );
                }
            }
        } finally {
            client.close();
        }
    }

    const workers =
        Array.from(
            {
                length: Math.min(
                    concurrency,
                    excelFiles.length,
                ),
            },
            () => worker(),
        );

    await Promise.all(
        workers,
    );

    return {
        results,
        processedFiles,
    };
}

export async function scanProjectFtp(
    projectId: string,
    projectName: string,
    stations: ScanStationInput[],
): Promise<ProjectFtpScanResult> {
    const client = await connectFtp();

    try {
        const projectPath =
            `/Projects/${projectName}`;

        const stationResults =
            new Map<
                string,
                StationFtpScanResult
            >();

        for (const station of stations) {
            stationResults.set(
                station.code,
                createInitialStationResult(
                    station.code,
                ),
            );
        }

        const projectItems =
            await client.list(
                projectPath,
            );

        const surveyStart = Date.now();

        await scanSurvey(
            client,
            projectPath,
            projectItems,
            stationResults,
        );

        console.log(
            "[FTP Survey]",
            Date.now() - surveyStart,
            "ms",
        );

        const hoSoPath =
            `${projectPath}/Ho so`;

        const hasHoSo =
            projectItems.some(
                (item) =>
                    item.type ===
                        FileType.Directory &&
                    item.name === "Ho so",
            );

        if (hasHoSo) {
            const documentsStart = Date.now();

            const excelFiles =
                await scanDocuments(
                    client,
                    hoSoPath,
                    stationResults,
                );

            console.log(
                "[FTP Documents]",
                Date.now() - documentsStart,
                "ms",
                `(${excelFiles.length} files)`,
            );

            const excelCacheStart =
                Date.now();

            const cachedExcelSources =
                await getFtpExcelSources(
                    projectId,
                );

            const cachedExcelByPath =
                new Map(
                    cachedExcelSources.map(
                        (source) => [
                            source.path,
                            source,
                        ],
                    ),
                );

            const excelFilesToScan =
                excelFiles.filter(
                    (file) => {
                        const cached =
                            cachedExcelByPath.get(
                                file.path,
                            );

                        if (!cached) {
                            return true;
                        }

                        const modifiedAt =
                            file.modifiedAt?.toISOString() ??
                            null;

                        return (
                            cached.size !==
                                file.size ||
                            cached.modifiedAt !==
                                modifiedAt
                        );
                    },
                );

            console.log(
                "[FTP Excel Cache]",
                "total",
                excelFiles.length,
                "cached",
                cachedExcelSources.length,
                "toScan",
                excelFilesToScan.length,
                "skip",
                excelFiles.length -
                    excelFilesToScan.length,
                "check",
                Date.now() -
                    excelCacheStart,
                "ms",
            );

            const excelStart =
                Date.now();

            const {
                results: excelResults,
                processedFiles,
            } =
                await scanExcelSources(
                    client,
                    excelFilesToScan,
                    stations.map(
                        (station) =>
                            station.code,
                    ),
                );

            console.log(
                "[FTP Excel]",
                Date.now() -
                    excelStart,
                "ms",
                `(${excelResults.length} results)`,
                `(${processedFiles.length} files processed)`,
            );

            const databaseStart =
                Date.now();

            const stationByCode =
                new Map(
                    stations.map(
                        (station) => [
                            station.code.toUpperCase(),
                            station,
                        ],
                    ),
                );

            const latestExcelResults =
                new Map<
                    string,
                    ExcelStationScanResult
                >();

            for (
                const excelResult
                of excelResults
            ) {
                latestExcelResults.set(
                    excelResult.stationCode.toUpperCase(),
                    excelResult,
                );
            }

            const excelDbUpdates =
                Array.from(
                    latestExcelResults.values(),
                ).flatMap(
                    (excelResult) => {
                        const station =
                            stationByCode.get(
                                excelResult.stationCode.toUpperCase(),
                            );

                        if (!station) {
                            return [];
                        }

                        return [
                            {
                                stationId:
                                    station.id,
                                address:
                                    excelResult.address,
                                excelSource:
                                    excelResult.fileName,
                            },
                        ];
                    },
                );

            await updateStationsFromExcel(
                excelDbUpdates,
            );

            console.log(
                "[FTP Excel DB]",
                Date.now() -
                    databaseStart,
                "ms",
            );

            if (
                processedFiles.length > 0
            ) {
                const cacheStart =
                    Date.now();

                await upsertFtpExcelSources(
                    projectId,
                    processedFiles,
                );

                console.log(
                    "[FTP Excel Cache Update]",
                    Date.now() -
                        cacheStart,
                    "ms",
                    `(${processedFiles.length} files)`,
                );
            }
        }

        const ftpResourceUpdates =
            stations.flatMap(
                (station) => {
                    const result =
                        stationResults.get(
                            station.code,
                        );

                    if (!result) {
                        return [];
                    }

                    return [
                        {
                            stationId:
                                station.id,
                            resources: {
                                survey:
                                    result.survey,
                                word:
                                    result.word,
                                visio:
                                    result.visio,
                                pdf:
                                    result.pdf,
                            },
                        },
                    ];
                },
            );

        await upsertStationsFtpResources(
            ftpResourceUpdates,
        );

        return {
            projectName,
            projectPath,
            stations:
                Array.from(
                    stationResults.values(),
                ),
        };
    } finally {
        client.close();
    }
}

export async function scanStationFtp(
    projectId: string,
    projectName: string,
    stationId: string,
    stationCode: string,
): Promise<StationFtpScanResult> {
    const result =
        await scanProjectFtp(
            projectId,
            projectName,
            [
                {
                    id: stationId,
                    code: stationCode,
                },
            ],
        );

    const station =
        result.stations[0];

    if (!station) {
        throw new Error(
            `Station scan returned no result for ${stationCode}.`,
        );
    }

    return station;
}