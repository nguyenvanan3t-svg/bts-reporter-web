export type FtpResourceStatus = "FOUND" | "MISSING";

export type FtpResourceType = "file" | "folder";

export type FtpResource = {
    status: FtpResourceStatus;
    type?: FtpResourceType;
    fileName?: string;
    path?: string;
    size?: number;
    modifiedAt?: string;
};

export type StationFtpScanResult = {
    stationCode: string;

    survey: FtpResource;
    word: FtpResource;
    visio: FtpResource;
    pdf: FtpResource;
};

export type ProjectFtpScanResult = {
    projectName: string;
    projectPath: string;

    stations: StationFtpScanResult[];
};