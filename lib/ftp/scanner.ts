import { FileType } from "basic-ftp";
import { Writable } from "node:stream";

import { connectFtp } from "@/lib/ftp/client";
import {
    upsertStationsFtpResources,
    updateStationFromExcel,
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

function isSurveyZipForStation(
    fileName: string,
    stationCode: string,
): boolean {
    if (!fileName.toLowerCase().endsWith(".zip")) {
        return false;
    }

    const baseName = fileName.slice(
        0,
        -4,
    );

    const escapedCode = stationCode.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
    );

    const pattern = new RegExp(
        `(^|_)${escapedCode}$`,
        "i",
    );

    return pattern.test(baseName);
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

function getResourceType(
    fileName: string,
    stationCode: string,
): "word" | "visio" | "pdf" | null {
    const escapedCode = stationCode.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
    );

    const pattern = new RegExp(
        `_\\(${escapedCode}\\)\\.(docx|vsdx|pdf)$`,
        "i",
    );

    const match = fileName.match(pattern);

    if (!match) {
        return null;
    }

    const extension = match[1].toLowerCase();

    if (extension === "docx") {
        return "word";
    }

    if (extension === "vsdx") {
        return "visio";
    }

    if (extension === "pdf") {
        return "pdf";
    }

    return null;
}

async function scanSurvey(
    client: Awaited<ReturnType<typeof connectFtp>>,
    projectPath: string,
    projectItems: FtpListItem[],
    stationResults: Map<string, StationFtpScanResult>,
) {
    let surveyListCount = 0;
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
                for (const stationCode of stationResults.keys()) {
                    if (
                        !isSurveyZipForStation(
                            item.name,
                            stationCode,
                        )
                    ) {
                        continue;
                    }

                    const result =
                        stationResults.get(
                            stationCode,
                        )!;

                    result.survey =
                        createFoundResource(
                            item,
                            `${provincePath}/${item.name}`,
                        );

                    break;
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
                    for (const stationCode of stationResults.keys()) {
                        if (
                            !isSurveyZipForStation(
                                stationFolder.name,
                                stationCode,
                            )
                        ) {
                            continue;
                        }

                        const result =
                            stationResults.get(
                                stationCode,
                            )!;

                        result.survey =
                            createFoundResource(
                                stationFolder,
                                `${intermediatePath}/${stationFolder.name}`,
                            );

                        break;
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
): Promise<string[]> {
    const stationCodes =
        Array.from(
            stationResults.keys(),
        );

    const excelFiles: string[] = [];

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
                excelFiles.push(
                    itemPath,
                );

                continue;
            }

            for (
                const stationCode of stationCodes
            ) {
                const resourceType =
                    getResourceType(
                        item.name,
                        stationCode,
                    );

                if (!resourceType) {
                    continue;
                }

                const result =
                    stationResults.get(
                        stationCode,
                    )!;

                result[resourceType] =
                    createFoundResource(
                        item,
                        itemPath,
                    );

                break;
            }
        }
    }

    await scanFolder(
        hoSoPath,
    );

    return excelFiles;
}

async function scanExcelSources(
    _client: Awaited<ReturnType<typeof connectFtp>>,
    excelFiles: string[],
    stationCodes: string[],
): Promise<ExcelStationScanResult[]> {
    const results: ExcelStationScanResult[] =
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

                const filePath =
                    excelFiles[index];

                const fileName =
                    filePath
                        .split("/")
                        .pop() ??
                    filePath;

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

                    await client.downloadTo(
                        writable,
                        filePath,
                    );

                    const buffer =
                        Buffer.concat(
                            chunks,
                        );

                    const matches =
                        parseExcelStationFile(
                            buffer,
                            fileName,
                            stationCodes,
                        );

                    results.push(
                        ...matches,
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

    return results;
}

export async function scanProjectFtp(
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

            const excelStart = Date.now();

            const excelResults =
                await scanExcelSources(
                    client,
                    excelFiles,
                    stations.map(
                        (station) =>
                            station.code,
                    ),
                );

            console.log(
                "[FTP Excel]",
                Date.now() - excelStart,
                "ms",
                `(${excelResults.length} results)`,
            );

            const databaseStart = Date.now();

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

            for (const excelResult of excelResults) {
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
                                station,
                                excelResult,
                            },
                        ];
                    },
                );

            const EXCEL_DB_UPDATE_CONCURRENCY = 8;

            for (
                let start = 0;
                start < excelDbUpdates.length;
                start += EXCEL_DB_UPDATE_CONCURRENCY
            ) {
                const batch =
                    excelDbUpdates.slice(
                        start,
                        start +
                            EXCEL_DB_UPDATE_CONCURRENCY,
                    );

                await Promise.all(
                    batch.map(
                        ({
                            station,
                            excelResult,
                        }) =>
                            updateStationFromExcel(
                                station.id,
                                excelResult.address,
                                excelResult.fileName,
                            ),
                    ),
                );
            }

            console.log(
                "[FTP Excel DB]",
                Date.now() - databaseStart,
                "ms",
            );
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
    projectName: string,
    stationId: string,
    stationCode: string,
): Promise<StationFtpScanResult> {
    const result =
        await scanProjectFtp(
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