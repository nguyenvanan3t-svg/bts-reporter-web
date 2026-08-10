export type ResourceType =
    | "survey"
    | "word"
    | "visio"
    | "pdf";

export type StationResource = {
    type: ResourceType;

    found: boolean;

    fileName?: string;

    remotePath?: string;

    updatedAt?: string;
};