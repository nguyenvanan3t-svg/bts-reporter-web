
export interface Station {
    id: string;

    projectId: string;

    code: string;

    province: string;

    address: string;

    excelSource: string | null;

    status: StationStatus;

    createdAt: string;

    updatedAt: string;

    isRemoved: boolean;

    hasDpn: boolean;

    project?: {

        id: string;

        code: string;

        name: string;

    };
}


export interface CreateStationDto {
    projectId: string;

    code: string;

    province: string;

    address: string;

    status: StationStatus;
}

export type StationStatus =
    | "PENDING"
    | "SURVEY"
    | "WORD"
    | "VISIO"
    | "PDF";

export type StationResourceType =
    | "survey"
    | "word"
    | "visio"
    | "pdf";

export type StationResourceStatus =
    | "FOUND"
    | "MISSING";

export type StationResourceKind =
    | "file"
    | "folder";

export interface StationResource {
    id: string;

    stationId: string;

    resourceType: StationResourceType;

    status: StationResourceStatus;

    type: StationResourceKind | null;

    fileName: string | null;

    path: string | null;

    size: number | null;

    modifiedAt: string | null;

    scannedAt: string;

    createdAt: string;

    updatedAt: string;
}