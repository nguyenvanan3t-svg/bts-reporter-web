import * as XLSX from "xlsx";

type ExcelStationMatch = {
    stationCode: string;
    fileName: string;
    address: string;
};

type ExcelSheetInfo = {
    sheetName: string;
    codeColumn: number;
    addressColumn: number;
    headerRow: number;
};

const EXCEL_SHEET_NAME = "BTSinfo";

function normalizeText(
    value: unknown,
): string {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            "",
        )
        .replace(/đ/g, "d");
}

function findColumn(
    headers: unknown[],
    candidates: string[],
): number {
    const normalizedCandidates =
        candidates.map(normalizeText);

    for (
        let index = 0;
        index < headers.length;
        index++
    ) {
        const header =
            normalizeText(headers[index]);

        if (
            normalizedCandidates.includes(
                header,
            )
        ) {
            return index;
        }
    }

    return -1;
}

function findSheetInfo(
    workbook: XLSX.WorkBook,
    sheetName: string,
): ExcelSheetInfo | null {
    const worksheet =
        workbook.Sheets[sheetName];

    if (!worksheet) {
        return null;
    }

    const rows =
        XLSX.utils.sheet_to_json<
            unknown[]
        >(worksheet, {
            header: 1,
            defval: "",
            raw: false,
        });

    const maxHeaderRows = Math.min(
        rows.length,
        30,
    );

    for (
        let rowIndex = 0;
        rowIndex < maxHeaderRows;
        rowIndex++
    ) {
        const row =
            rows[rowIndex] ?? [];

        const codeColumn =
            findColumn(
                row,
                [
                    "Mã trạm",
                    "Mã trạm gốc id",
                    "Mã trạm gốc",
                ],
            );

        const addressColumn =
            findColumn(
                row,
                [
                    "Địa chỉ thực tế",
                    "Địa điểm lắp đặt",
                ],
            );

        if (
            codeColumn !== -1 &&
            addressColumn !== -1
        ) {
            return {
                sheetName,
                codeColumn,
                addressColumn,
                headerRow: rowIndex,
            };
        }
    }

    return null;
}

function findSheet(
    workbook: XLSX.WorkBook,
): ExcelSheetInfo | null {
    return findSheetInfo(
        workbook,
        EXCEL_SHEET_NAME,
    );
}

export function parseExcelStationFile(
    buffer: Buffer,
    fileName: string,
    stationCodes: string[],
): ExcelStationMatch[] {
    const workbook =
        XLSX.read(buffer, {
            type: "buffer",
            cellDates: true,
        });

    const sheetInfo =
        findSheet(workbook);

    if (!sheetInfo) {
        return [];
    }

    const worksheet =
        workbook.Sheets[
            sheetInfo.sheetName
        ];

    const rows =
        XLSX.utils.sheet_to_json<
            unknown[]
        >(worksheet, {
            header: 1,
            defval: "",
            raw: false,
        });

    const stationCodeSet =
        new Set(stationCodes);

    const results: ExcelStationMatch[] =
        [];

    for (
        let rowIndex =
            sheetInfo.headerRow + 1;
        rowIndex < rows.length;
        rowIndex++
    ) {
        const row =
            rows[rowIndex] ?? [];

        const stationCode =
            String(
                row[
                    sheetInfo.codeColumn
                ] ?? "",
            ).trim();

        if (
            !stationCode ||
            !stationCodeSet.has(
                stationCode,
            )
        ) {
            continue;
        }

        const address =
            String(
                row[
                    sheetInfo.addressColumn
                ] ?? "",
            ).trim();

        if (!address) {
            continue;
        }

        results.push({
            stationCode,
            fileName,
            address,
        });
    }

    return results;
}