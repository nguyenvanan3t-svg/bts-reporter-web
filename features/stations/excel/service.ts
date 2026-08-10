import type { Station } from "../types";
import { readExcel } from "./reader";
import { parseExcelRows } from "./parser";
import {
    compareStations,
} from "./compare";

import {
    validateStations,
} from "./validator";


export async function importStationExcel(
    file: File,
    currentStations: Station[],
) {

    const rows =
        await readExcel(file);

    const stations =
        parseExcelRows(rows);

    const validation =
        validateStations(stations);

    const compare =
        compareStations(
            validation.validStations,
            currentStations,
        );

    const previewStations =
        compare.items.map((item) => ({

            action: item.action,

            code:
                item.imported?.code ??
                item.current?.code ??
                "",

            province:
                item.imported?.province ??
                item.current?.province ??
                "",

            address:
                item.imported?.address ??
                item.current?.address ??
                "",

        }));

    return {

        validation,

        compare,

        preview: {

            stations: previewStations,

            summary: compare.summary,

            duplicated:
                validation.errors.filter(
                    (error) =>
                        error.message.startsWith(
                            "Duplicate Station Code:",
                        ),
                ).length,

            invalid:
                validation.errors.filter(
                    (error) =>
                        error.message ===
                        "Station Code is required.",
                ).length,

        },

    };
}
