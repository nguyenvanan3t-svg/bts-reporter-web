
export interface Station {
    id: string;

    projectId: string;

    code: string;

    province: string;

    address: string;

    status: StationStatus;

    createdAt: string;

    updatedAt: string;

    isRemoved: boolean;

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