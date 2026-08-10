import type { Station } from "./types";

export function exportStationsCsv(
    stations: Station[],
    fileName: string,
) {

    const rows = [
        [
            "Station",
            "Province",
            "Address",
            "Status",
        ],

        ...stations.map((station) => [

            station.code,

            station.province,

            station.address,

            station.status,

        ]),

    ];

    const csv = rows
        .map((row) =>
            row
                .map((cell) => `"${cell ?? ""}"`)
                .join(","),
        )
        .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csv],
        {
            type: "text/csv;charset=utf-8;",
        },
    );

    const url = URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    const safeFileName = fileName.replace(
        /[\\/:*?"<>|]/g,
        "_",
    );

    link.download = `${safeFileName}.csv`;

    link.click();

    URL.revokeObjectURL(url);

}