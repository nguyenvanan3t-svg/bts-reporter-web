import type {
    Station,
    CreateStationDto,
    StationResource,
    CompareResult,
} from "./types";

import {
    getStationsByProject,
    getAllStationsByProject,
    getStationById,
    searchStationsByCode,
    removeStation,
    createStations,
    updateStation,
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

export async function getResources(
    stationId: string,
): Promise<StationResource[]> {

    return [

        {
            type: "survey",
            found: true,
            fileName: "survey.json",
        },

        {
            type: "word",
            found: false,
        },

        {
            type: "visio",
            found: true,
            fileName: "DBN0075-13.vsdx",
        },

        {
            type: "pdf",
            found: true,
            fileName: "DBN0075-13.pdf",
        },

    ];

}