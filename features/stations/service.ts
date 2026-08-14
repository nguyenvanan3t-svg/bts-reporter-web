import type {
    Station,
    CreateStationDto,
    CompareResult,
    StationFtpResources,
} from "./types";

import {
    getStationsByProject,
    getAllStationsByProject,
    getStationById,
    getStationFtpResources,
    upsertStationFtpResources,
    searchStationsByCode,
    removeStation,
    createStations,
    updateStation,
    getStationByProjectAndCode,
    getProjectFtpResources,
    getLatestProjectFtpScan,
    getProjectFtpScanHistory,
} from "./repository";

export async function loadStations(
    projectId: string,
): Promise<Station[]> {

    return getStationsByProject(projectId);

}

export async function loadAllStations(
    projectId: string,
): Promise<Station[]> {

    return getAllStationsByProject(
        projectId,
    );

}

export async function getById(
    id: string,
) {

    return getStationById(id);

}

export async function getByProjectAndCode(
    projectId: string,
    code: string,
): Promise<Station | null> {

    return getStationByProjectAndCode(
        projectId,
        code,
    );
}

export async function loadFtpResources(
    stationId: string,
): Promise<StationFtpResources> {

    return getStationFtpResources(
        stationId,
    );

}

export async function loadProjectFtpResources(
    projectId: string,
): Promise<
    Record<string, StationFtpResources>
> {
    return getProjectFtpResources(
        projectId,
    );
}

export async function loadLatestProjectFtpScan(
    projectId: string,
) {
    return getLatestProjectFtpScan(
        projectId,
    );
}

export async function loadProjectFtpScanHistory(
    projectId: string,
) {
    return getProjectFtpScanHistory(
        projectId,
    );
}

export async function saveFtpResources(
    stationId: string,
    resources: StationFtpResources,
): Promise<void> {

    await upsertStationFtpResources(
        stationId,
        resources,
    );

}

export async function searchByCode(
    keyword: string,
) {

    return searchStationsByCode(keyword);

}

export async function importStations(
    projectId: string,
    compare: CompareResult,
): Promise<void> {

    const stationsToCreate: CreateStationDto[] = [];

    for (const item of compare.items) {

        switch (item.action) {

            case "ADD":

                if (!item.imported) {
                    continue;
                }

                stationsToCreate.push({

                    projectId,

                    code:
                        item.imported.code,

                    province:
                        item.imported.province,

                    address:
                        item.imported.address,

                    status: "PENDING",

                });

                break;

            case "UPDATE":

                if (!item.current || !item.imported) {
                    continue;
                }

                await updateStation(
                    item.current.id,
                    item.imported.province,
                    item.imported.address,
                );

                break;

            case "REMOVE":

                if (!item.current) {
                    continue;
                }

                await removeStation(
                    item.current.id,
                );

                break;

            case "RESTORE":

                if (!item.current || !item.imported) {
                    continue;
                }

                await updateStation(
                    item.current.id,
                    item.imported.province,
                    item.imported.address,
                );

                break;

            case "UNCHANGED":

                break;

        }

    }

    if (stationsToCreate.length > 0) {

        await createStations(
            stationsToCreate,
        );

    }

}

export async function removeFromProject(
    stationId: string,
): Promise<void> {

    await removeStation(stationId);

}
