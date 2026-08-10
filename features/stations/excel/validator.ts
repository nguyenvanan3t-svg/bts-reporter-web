import type {
    ImportStationDto,
    ValidationError,
    ValidationResult,
} from "../types";

export function validateStations(
    rows: ImportStationDto[],
): ValidationResult {
    const errors: ValidationError[] = [];
    const validStations: ImportStationDto[] = [];

    const stationCodes = new Set<string>();

    rows.forEach((row, index) => {
        if (!row.code) {
            errors.push({
                row: index + 1,
                message: "Station Code is required.",
            });

            return;
        }

        if (stationCodes.has(row.code)) {
            errors.push({
                row: index + 1,
                message: `Duplicate Station Code: ${row.code}`,
            });

            return;
        }

        stationCodes.add(row.code);

        validStations.push(row);
    });

    return {
        validStations,
        errors,
    };
}