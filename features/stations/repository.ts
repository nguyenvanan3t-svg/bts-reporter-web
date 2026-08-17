import { supabase } from "@/lib/supabase";

import type {
    Station,
    CreateStationDto,
    StationFtpResource,
    StationFtpResources,
} from "./types";

const TABLE = "stations";

const STATION_PAGE_SIZE = 1000;

async function fetchStationsByProject(
    projectId: string,
    includeRemoved: boolean,
): Promise<any[]> {

    const allRows: any[] = [];

    let from = 0;

    while (true) {

        let query = supabase
            .from("stations")
            .select("*")
            .eq("project_id", projectId)
            .order("code")
            .range(
                from,
                from + STATION_PAGE_SIZE - 1,
            );

        if (!includeRemoved) {
            query = query.eq(
                "is_removed",
                false,
            );
        }

        const {
            data,
            error,
        } = await query;

        if (error) {
            throw error;
        }

        const rows = data ?? [];

        allRows.push(
            ...rows,
        );

        if (
            rows.length <
            STATION_PAGE_SIZE
        ) {
            break;
        }

        from += STATION_PAGE_SIZE;
    }

    return allRows;
}

export async function getStationsByProject(
    projectId: string,
): Promise<Station[]> {

    const data =
        await fetchStationsByProject(
            projectId,
            false,
        );

    return data.map((item) => ({
        id: item.id,
        projectId: item.project_id,
        code: item.code,
        province: item.province,
        address: item.address,
        excelSource: item.excel_source ?? null,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        isRemoved: item.is_removed,
    }));
}

export async function getStationScanInputsByProject(
    projectId: string,
): Promise<
    Array<{
        id: string;
        code: string;
    }>
> {

    const allRows: Array<{
        id: string;
        code: string;
    }> = [];

    let from = 0;

    while (true) {

        const {
            data,
            error,
        } = await supabase
            .from("stations")
            .select("id, code")
            .eq(
                "project_id",
                projectId,
            )
            .eq(
                "is_removed",
                false,
            )
            .order("code")
            .range(
                from,
                from +
                    STATION_PAGE_SIZE -
                    1,
            );

        if (error) {
            throw error;
        }

        const rows =
            data ?? [];

        allRows.push(
            ...rows,
        );

        if (
            rows.length <
            STATION_PAGE_SIZE
        ) {
            break;
        }

        from +=
            STATION_PAGE_SIZE;
    }

    return allRows;
}

export async function getAllStationsByProject(
    projectId: string,
): Promise<Station[]> {

    const data =
        await fetchStationsByProject(
            projectId,
            true,
        );

    return data.map((item) => ({
        id: item.id,
        projectId: item.project_id,
        code: item.code,
        province: item.province,
        address: item.address,
        excelSource: item.excel_source ?? null,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        isRemoved: item.is_removed,
    }));
}

export async function getStationByProjectAndCode(
    projectId: string,
    code: string,
): Promise<Station | null> {

    const { data, error } = await supabase
        .from("stations")
        .select("*")
        .eq("project_id", projectId)
        .eq("code", code)
        .eq("is_removed", false)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        return null;
    }

    return {
        id: data.id,
        projectId: data.project_id,
        code: data.code,
        province: data.province,
        address: data.address,
        excelSource: data.excel_source ?? null,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isRemoved: data.is_removed,
    };
}

export async function hasStationsByProject(
    projectId: string,
): Promise<boolean> {
    const { count, error } = await supabase
        .from("stations")
        .select("id", {
            count: "exact",
            head: true,
        })
        .eq("project_id", projectId);

    if (error) {
        throw error;
    }

    return (count ?? 0) > 0;
}

export async function createStations(
    stations: CreateStationDto[],
): Promise<void> {

    if (stations.length === 0) {
        return;
    }

    const { error } = await supabase
        .from("stations")
        .insert(
            stations.map((station) => ({
                project_id: station.projectId,
                code: station.code,
                province: station.province,
                address: station.address,
                status: station.status,
            })),
        );

    if (error) {
        throw error;
    }

}

export async function updateStation(
    stationId: string,
    province: string,
    address: string,
): Promise<void> {

    const { error } = await supabase
        .from(TABLE)
        .update({
            province,
            address,
            updated_at: new Date().toISOString(),
            is_removed: false,
        })
        .eq("id", stationId);

    if (error) {
        throw error;
    }

}

export async function updateStationFromExcel(
    stationId: string,
    address: string,
    excelSource: string,
): Promise<void> {

    const { error } = await supabase
        .from(TABLE)
        .update({
            address,
            excel_source: excelSource,
            updated_at: new Date().toISOString(),
            is_removed: false,
        })
        .eq("id", stationId);

    if (error) {
        throw error;
    }
}

export async function removeStation(
    stationId: string,
): Promise<void> {

    const { error } = await supabase
        .from("stations")
        .update({
            is_removed: true,
        })
        .eq("id", stationId);

    if (error) {
        throw error;
    }

}

export async function getStationById(
    id: string,
) {

    const { data, error } = await supabase
        .from("stations")
        .select(`
            *,
            project:projects (
                id,
                code,
                name
            )
        `)
        .eq("id", id)
        .single();

    if (error) {

        throw error;

    }

    return {
        id: data.id,
        projectId: data.project_id,
        code: data.code,
        province: data.province,
        address: data.address,
        excelSource: data.excel_source ?? null,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isRemoved: data.is_removed,

        project: data.project,
    };

}

export async function getStationFtpResources(
    stationId: string,
): Promise<StationFtpResources> {

    const { data, error } = await supabase
        .from("station_resources")
        .select("*")
        .eq("station_id", stationId);

    if (error) {
        throw error;
    }

    const resources: StationFtpResources = {
        survey: {
            status: "MISSING",
        },
        word: {
            status: "MISSING",
        },
        visio: {
            status: "MISSING",
        },
        pdf: {
            status: "MISSING",
        },
    };

    for (const item of data ?? []) {

        const resource: StationFtpResource = {
            status: item.status,
            type: item.type ?? undefined,
            fileName: item.file_name ?? undefined,
            path: item.path ?? undefined,
            size: item.size ?? undefined,
            modifiedAt: item.modified_at ?? undefined,
        };

        if (item.resource_type === "survey") {
            resources.survey = resource;
        }

        if (item.resource_type === "word") {
            resources.word = resource;
        }

        if (item.resource_type === "visio") {
            resources.visio = resource;
        }

        if (item.resource_type === "pdf") {
            resources.pdf = resource;
        }
    }

    return resources;
}

export async function getProjectFtpResources(
    projectId: string,
): Promise<Record<string, StationFtpResources>> {

    const stations =
        await getStationsByProject(projectId);

    if (stations.length === 0) {
        return {};
    }

    const stationIds =
        stations.map(
            (station) => station.id,
        );

    const RESOURCE_QUERY_BATCH_SIZE = 500;

    const allResourceRows: any[] = [];

    for (
        let start = 0;
        start < stationIds.length;
        start += RESOURCE_QUERY_BATCH_SIZE
    ) {
        const batchIds =
            stationIds.slice(
                start,
                start +
                    RESOURCE_QUERY_BATCH_SIZE,
            );

        const {
            data,
            error,
        } = await supabase
            .from("station_resources")
            .select("*")
            .in(
                "station_id",
                batchIds,
            );

        if (error) {
            throw error;
        }

        allResourceRows.push(
            ...(data ?? []),
        );
    }

    const resourcesByStation:
        Record<string, StationFtpResources> = {};

    for (const station of stations) {

        resourcesByStation[station.id] = {
            survey: {
                status: "MISSING",
            },
            word: {
                status: "MISSING",
            },
            visio: {
                status: "MISSING",
            },
            pdf: {
                status: "MISSING",
            },
        };
    }

    for (const item of allResourceRows) {

        const stationResources =
            resourcesByStation[
                item.station_id
            ];

        if (!stationResources) {
            continue;
        }

        const resource:
            StationFtpResource = {
            status: item.status,
            type:
                item.type ??
                undefined,
            fileName:
                item.file_name ??
                undefined,
            path:
                item.path ??
                undefined,
            size:
                item.size ??
                undefined,
            modifiedAt:
                item.modified_at ??
                undefined,
        };

        if (
            item.resource_type ===
            "survey"
        ) {
            stationResources.survey =
                resource;
        }

        if (
            item.resource_type ===
            "word"
        ) {
            stationResources.word =
                resource;
        }

        if (
            item.resource_type ===
            "visio"
        ) {
            stationResources.visio =
                resource;
        }

        if (
            item.resource_type ===
            "pdf"
        ) {
            stationResources.pdf =
                resource;
        }
    }

    return resourcesByStation;
}

export async function upsertStationFtpResources(
    stationId: string,
    resources: StationFtpResources,
): Promise<void> {

    const scannedAt = new Date().toISOString();

    const rows = [
        {
            station_id: stationId,
            resource_type: "survey",
            status: resources.survey.status,
            type: resources.survey.type ?? null,
            file_name: resources.survey.fileName ?? null,
            path: resources.survey.path ?? null,
            size: resources.survey.size ?? null,
            modified_at: resources.survey.modifiedAt ?? null,
            scanned_at: scannedAt,
            updated_at: scannedAt,
        },
        {
            station_id: stationId,
            resource_type: "word",
            status: resources.word.status,
            type: resources.word.type ?? null,
            file_name: resources.word.fileName ?? null,
            path: resources.word.path ?? null,
            size: resources.word.size ?? null,
            modified_at: resources.word.modifiedAt ?? null,
            scanned_at: scannedAt,
            updated_at: scannedAt,
        },
        {
            station_id: stationId,
            resource_type: "visio",
            status: resources.visio.status,
            type: resources.visio.type ?? null,
            file_name: resources.visio.fileName ?? null,
            path: resources.visio.path ?? null,
            size: resources.visio.size ?? null,
            modified_at: resources.visio.modifiedAt ?? null,
            scanned_at: scannedAt,
            updated_at: scannedAt,
        },
        {
            station_id: stationId,
            resource_type: "pdf",
            status: resources.pdf.status,
            type: resources.pdf.type ?? null,
            file_name: resources.pdf.fileName ?? null,
            path: resources.pdf.path ?? null,
            size: resources.pdf.size ?? null,
            modified_at: resources.pdf.modifiedAt ?? null,
            scanned_at: scannedAt,
            updated_at: scannedAt,
        },
    ];

    const { error } = await supabase
        .from("station_resources")
        .upsert(rows, {
            onConflict: "station_id,resource_type",
        });

    if (error) {
        throw error;
    }
}

const FTP_RESOURCE_BATCH_SIZE = 200;
const FTP_RESOURCE_CONCURRENCY = 4;

export async function upsertStationsFtpResources(
    items: Array<{
        stationId: string;
        resources: StationFtpResources;
    }>,
): Promise<void> {

    if (items.length === 0) {
        return;
    }

    const batches: Array<
        Array<{
            stationId: string;
            resources: StationFtpResources;
        }>
    > = [];

    for (
        let start = 0;
        start < items.length;
        start += FTP_RESOURCE_BATCH_SIZE
    ) {
        batches.push(
            items.slice(
                start,
                start +
                    FTP_RESOURCE_BATCH_SIZE,
            ),
        );
    }

    for (
        let start = 0;
        start < batches.length;
        start += FTP_RESOURCE_CONCURRENCY
    ) {
        const concurrentBatches =
            batches.slice(
                start,
                start +
                    FTP_RESOURCE_CONCURRENCY,
            );

        await Promise.all(
            concurrentBatches.map(
                async (
                    batch,
                    batchIndex,
                ) => {

                    const scannedAt =
                        new Date().toISOString();

                    const rows =
                        batch.flatMap(
                            (item) => [
                                {
                                    station_id:
                                        item.stationId,
                                    resource_type:
                                        "survey",
                                    status:
                                        item.resources
                                            .survey
                                            .status,
                                    type:
                                        item.resources
                                            .survey
                                            .type ??
                                        null,
                                    file_name:
                                        item.resources
                                            .survey
                                            .fileName ??
                                        null,
                                    path:
                                        item.resources
                                            .survey
                                            .path ??
                                        null,
                                    size:
                                        item.resources
                                            .survey
                                            .size ??
                                        null,
                                    modified_at:
                                        item.resources
                                            .survey
                                            .modifiedAt ??
                                        null,
                                    scanned_at:
                                        scannedAt,
                                    updated_at:
                                        scannedAt,
                                },

                                {
                                    station_id:
                                        item.stationId,
                                    resource_type:
                                        "word",
                                    status:
                                        item.resources
                                            .word
                                            .status,
                                    type:
                                        item.resources
                                            .word
                                            .type ??
                                        null,
                                    file_name:
                                        item.resources
                                            .word
                                            .fileName ??
                                        null,
                                    path:
                                        item.resources
                                            .word
                                            .path ??
                                        null,
                                    size:
                                        item.resources
                                            .word
                                            .size ??
                                        null,
                                    modified_at:
                                        item.resources
                                            .word
                                            .modifiedAt ??
                                        null,
                                    scanned_at:
                                        scannedAt,
                                    updated_at:
                                        scannedAt,
                                },

                                {
                                    station_id:
                                        item.stationId,
                                    resource_type:
                                        "visio",
                                    status:
                                        item.resources
                                            .visio
                                            .status,
                                    type:
                                        item.resources
                                            .visio
                                            .type ??
                                        null,
                                    file_name:
                                        item.resources
                                            .visio
                                            .fileName ??
                                        null,
                                    path:
                                        item.resources
                                            .visio
                                            .path ??
                                        null,
                                    size:
                                        item.resources
                                            .visio
                                            .size ??
                                        null,
                                    modified_at:
                                        item.resources
                                            .visio
                                            .modifiedAt ??
                                        null,
                                    scanned_at:
                                        scannedAt,
                                    updated_at:
                                        scannedAt,
                                },

                                {
                                    station_id:
                                        item.stationId,
                                    resource_type:
                                        "pdf",
                                    status:
                                        item.resources
                                            .pdf
                                            .status,
                                    type:
                                        item.resources
                                            .pdf
                                            .type ??
                                        null,
                                    file_name:
                                        item.resources
                                            .pdf
                                            .fileName ??
                                        null,
                                    path:
                                        item.resources
                                            .pdf
                                            .path ??
                                        null,
                                    size:
                                        item.resources
                                            .pdf
                                            .size ??
                                        null,
                                    modified_at:
                                        item.resources
                                            .pdf
                                            .modifiedAt ??
                                        null,
                                    scanned_at:
                                        scannedAt,
                                    updated_at:
                                        scannedAt,
                                },
                            ],
                        );

                    const batchStart =
                        Date.now();

                    const { error } =
                        await supabase
                            .from(
                                "station_resources",
                            )
                            .upsert(
                                rows,
                                {
                                    onConflict:
                                        "station_id,resource_type",
                                },
                            );

                    if (error) {
                        throw error;
                    }

                    console.log(
                        "[FTP Resource DB] batch:",
                        start +
                            batchIndex +
                            1,
                        "/",
                        batches.length,
                        "stations:",
                        batch.length,
                        "time:",
                        Date.now() -
                            batchStart,
                        "ms",
                    );
                },
            ),
        );
    }
}

export async function getLatestProjectFtpScan(
    projectId: string,
): Promise<{
    id: string;
    startedAt: string;
    completedAt: string | null;
    status: "RUNNING" | "COMPLETED" | "FAILED";
} | null> {

    const { data, error } = await supabase
        .from("ftp_scan_runs")
        .select(
            "id, started_at, completed_at, status",
        )
        .eq("project_id", projectId)
        .order("started_at", {
            ascending: false,
        })
        .limit(1)
        .maybeSingle();

    if (error) {
        throw error;
    }

    if (!data) {
        return null;
    }

    return {
        id: data.id,
        startedAt: data.started_at,
        completedAt:
            data.completed_at,
        status: data.status,
    };
}

export async function getProjectFtpScanHistory(
    projectId: string,
): Promise<
    Array<{
        id: string;
        startedAt: string;
        completedAt: string | null;
        status:
            | "RUNNING"
            | "COMPLETED"
            | "FAILED";
        totalStations: number;
        surveyFound: number;
        wordFound: number;
        visioFound: number;
        pdfFound: number;
    }>
> {
    const { data, error } = await supabase
        .from("ftp_scan_runs")
        .select(
            `
            id,
            started_at,
            completed_at,
            status,
            total_stations,
            survey_found,
            word_found,
            visio_found,
            pdf_found
            `,
        )
        .eq("project_id", projectId)
        .order("started_at", {
            ascending: false,
        })
        .limit(30);

    if (error) {
        throw error;
    }

    return (data ?? []).map(
        (item) => ({
            id: item.id,
            startedAt:
                item.started_at,
            completedAt:
                item.completed_at,
            status:
                item.status,
            totalStations:
                item.total_stations,
            surveyFound:
                item.survey_found,
            wordFound:
                item.word_found,
            visioFound:
                item.visio_found,
            pdfFound:
                item.pdf_found,
        }),
    );
}

export async function cleanupOldProjectFtpScans(
    projectId: string,
): Promise<void> {
    const { data, error } = await supabase
        .from("ftp_scan_runs")
        .select("id")
        .eq("project_id", projectId)
        .order("started_at", {
            ascending: false,
        })
        .range(30, 9999);

    if (error) {
        throw error;
    }

    const oldIds =
        (data ?? []).map(
            (item) => item.id,
        );

    if (oldIds.length === 0) {
        return;
    }

    const { error: deleteError } =
        await supabase
            .from("ftp_scan_runs")
            .delete()
            .in("id", oldIds);

    if (deleteError) {
        throw deleteError;
    }
}

export async function searchStationsByCode(
    keyword: string,
) {

    const { data, error } = await supabase
        .from("stations")
        .select(`
            id,
            code,
            province,
            address,

            project:projects(
                id,
                code,
                name,
                customer,
                year,
                status
            )
        `)
        .ilike("code", `%${keyword}%`)
        .eq("is_removed", false)
        .order("code");

    if (error) {
        throw error;
    }

    return data ?? [];
}