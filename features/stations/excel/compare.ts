import type {
    ImportStationDto,
    Station,
    CompareItem,
    CompareResult,
} from "../types";

export function compareStations(
    imported: ImportStationDto[],
    current: Station[],
): CompareResult {

    const items: CompareItem[] = [];

    let added = 0;

    let updated = 0;

    let removed = 0;

    let unchanged = 0;
    const stationMap = new Map(
        current.map((station) => [
            station.code,
            station,
        ]),
    );

    for (const station of imported) {
        const currentStation =
            stationMap.get(station.code);

        if (!currentStation) {

            items.push({

                action: "ADD",

                imported: station,

            });

            added++;

            continue;

            }

            if (currentStation.isRemoved) {

                items.push({

                    action: "RESTORE",

                    imported: station,

                    current: currentStation,

                });

                updated++;

                continue;
            }

            const isUpdated =
                currentStation.province !== station.province ||
                currentStation.address !== station.address;

            if (isUpdated) {

                items.push({

                    action: "UPDATE",

                    imported: station,

                    current: currentStation,

                });

                updated++;

            } else {

                items.push({

                    action: "UNCHANGED",

                    imported: station,

                    current: currentStation,

                });

                unchanged++;

            }
    }

    const importedCodes = new Set(
        imported.map((item) => item.code),
    );

    for (const station of current) {

        if (
            station.isRemoved
        ) {
            continue;
        }

        if (
            !importedCodes.has(station.code)
        ) {

            items.push({

                action: "REMOVE",

                current: station,

            });

            removed++;

        }

    }

    return {

        items,

        summary: {

            total: imported.length,

            added,

            updated,

            removed,

            unchanged,

        },

    };

}