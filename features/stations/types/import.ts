import type {
    Station,
} from "../models";

export interface ImportStationDto {
    code: string;

    province: string;

    address: string;
}

export type ImportAction =
    | "ADD"
    | "UPDATE"
    | "REMOVE"
    | "RESTORE"
    | "UNCHANGED";

export interface CompareItem {
    action: ImportAction;

    imported?: ImportStationDto;

    current?: Station;
}

export interface CompareSummary {
    total: number;

    added: number;

    updated: number;

    removed: number;

    unchanged: number;
}

export interface CompareResult {
    items: CompareItem[];

    summary: CompareSummary;
}

export interface PreviewStation {

    action: ImportAction;

    code: string;

    province: string;

    address: string;

}

export interface ImportPreviewResult {

    stations: PreviewStation[];

    summary: CompareSummary;

    duplicated: number;

    invalid: number;

}

export interface ValidationError {
    row: number;

    message: string;
}

export interface ValidationResult {
    validStations: ImportStationDto[];

    errors: ValidationError[];
}

export interface CompareItem {
    action: ImportAction;

    imported?: ImportStationDto;

    current?: Station;
}

export interface CompareSummary {
    total: number;

    added: number;

    updated: number;

    removed: number;

    unchanged: number;
}

export interface CompareResult {
    items: CompareItem[];

    summary: CompareSummary;
}

export interface ValidationError {
    row: number;

    message: string;
}

export interface ValidationResult {
    validStations: ImportStationDto[];

    errors: ValidationError[];
}