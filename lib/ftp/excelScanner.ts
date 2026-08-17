import * as XLSX from "xlsx";

type ExcelStationMatch = {
    stationCode: string;
    fileName: string;
    address: string;
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

export function parseExcelStationFile(
    buffer: Buffer,
    fileName: string,
    stationCodes: string[],
): ExcelStationMatch[] {
    const workbook =
        XLSX.read(buffer, {
            type: "buffer",
            cellDates: false,
            sheets: "BTSinfo",
        });

    /*
     * Business Rule:
     * Chỉ đọc sheet BTSinfo.
     *
     * Không xử lý các sheet khác.
     */
    const worksheet =
        workbook.Sheets[
            EXCEL_SHEET_NAME
        ];

    if (!worksheet) {
        return [];
    }

    /*
     * Chuyển BTSinfo thành rows đúng một lần.
     *
     * Trước đây sheet_to_json() được gọi:
     * 1. lần để tìm header
     * 2. lần nữa để đọc dữ liệu
     *
     * Bây giờ dùng chung một rows.
     */
    const rows =
        XLSX.utils.sheet_to_json<
            unknown[]
        >(worksheet, {
            header: 1,
            defval: "",
            raw: false,
        });

    /*
     * Tìm header trong 30 dòng đầu.
     */
    const maxHeaderRows =
        Math.min(
            rows.length,
            30,
        );

    let codeColumn = -1;
    let addressColumn = -1;
    let headerRow = -1;

    for (
        let rowIndex = 0;
        rowIndex < maxHeaderRows;
        rowIndex++
    ) {
        const row =
            rows[rowIndex] ?? [];

        const foundCodeColumn =
            findColumn(
                row,
                [
                    "Mã trạm",
                    "Mã trạm gốc id",
                    "Mã trạm gốc",
                ],
            );

        const foundAddressColumn =
            findColumn(
                row,
                [
                    "Địa chỉ thực tế",
                    "Địa điểm lắp đặt",
                ],
            );

        if (
            foundCodeColumn !== -1 &&
            foundAddressColumn !== -1
        ) {
            codeColumn =
                foundCodeColumn;

            addressColumn =
                foundAddressColumn;

            headerRow =
                rowIndex;

            break;
        }
    }

    if (
        codeColumn === -1 ||
        addressColumn === -1 ||
        headerRow === -1
    ) {
        return [];
    }

    const stationCodeSet =
        new Set(stationCodes);

    const results: ExcelStationMatch[] =
        [];

    for (
        let rowIndex =
            headerRow + 1;
        rowIndex < rows.length;
        rowIndex++
    ) {
        const row =
            rows[rowIndex] ?? [];

        const stationCode =
            String(
                row[codeColumn] ?? "",
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
                row[addressColumn] ?? "",
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