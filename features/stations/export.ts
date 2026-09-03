import * as XLSX from "xlsx";
import type { Station } from "./types";

export function exportStationsExcel(
    stations: Station[],
    fileName: string,
) {
    const rows = [
        [
            "STT",
            "Mã trạm",
            "Tỉnh / TP",
            "Địa chỉ lắp đặt",
            "Địa chỉ đội đo",
            "Ghi chú",
            "Date",
        ],

        ...stations.map(
            (station, index) => [
                index + 1,
                station.code,
                station.province,
                station.address,
                "",
                "",
                "",
            ],
        ),
    ];

    const worksheet =
        XLSX.utils.aoa_to_sheet(rows);

    worksheet["!cols"] = [
        { wch: 8 },
        { wch: 16 },
        { wch: 20 },
        { wch: 70 },
        { wch: 30 },
        { wch: 30 },
        { wch: 15 },
    ];

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Sheet1",
    );

    const safeFileName =
        fileName.replace(
            /[\\/:*?"<>|]/g,
            "_",
        );

    XLSX.writeFile(
        workbook,
        `${safeFileName}.xlsx`,
    );
}