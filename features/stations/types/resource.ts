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

export type StationFtpResourceStatus =
    | "FOUND"
    | "MISSING";

export type StationFtpResourceType =
    | "file"
    | "folder";

export type StationFtpResource = {
    status: StationFtpResourceStatus;
    type?: StationFtpResourceType;
    fileName?: string;
    path?: string;
    size?: number;
    modifiedAt?: string;
};

export type StationFtpResources = {
    survey: StationFtpResource;
    word: StationFtpResource;
    visio: StationFtpResource;
    pdf: StationFtpResource;
};