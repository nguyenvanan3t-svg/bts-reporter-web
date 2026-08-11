import { supabase } from "@/lib/supabase";

import type {
    Station,
    CreateStationDto,
} from "./types";

const TABLE = "stations";

export async function getStationsByProject(
    projectId: string,
): Promise<Station[]> {

    const { data, error } = await supabase
        .from("stations")
        .select("*")
        .eq("project_id", projectId)
        .eq("is_removed", false)
        .order("code");

    if (error) {
        throw error;
    }

    return (data ?? []).map((item) => ({
        id: item.id,
        projectId: item.project_id,
        code: item.code,
        province: item.province,
        address: item.address,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        isRemoved: item.is_removed,
    }));
}

export async function getAllStationsByProject(
    projectId: string,
): Promise<Station[]> {

    const { data, error } = await supabase
        .from("stations")
        .select("*")
        .eq("project_id", projectId)
        .order("code");

    if (error) {
        throw error;
    }

    return (data ?? []).map((item) => ({
        id: item.id,
        projectId: item.project_id,
        code: item.code,
        province: item.province,
        address: item.address,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        isRemoved: item.is_removed,
    }));
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

    return data;

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