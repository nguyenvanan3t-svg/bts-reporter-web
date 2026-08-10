import type { ImportStationDto } from "../types";

export function parseExcelRows(
    rows: any[][],
): ImportStationDto[] {
    return rows
        .slice(1)
        .filter((row) => row[1])
        .map((row) => ({
            code: String(row[1]).trim(),
            province: String(row[2] ?? "").trim(),
            address: String(row[3] ?? "").trim(),
        }));
}