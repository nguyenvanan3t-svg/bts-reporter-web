import * as XLSX from "xlsx";

export async function readExcel(
    file: File,
): Promise<any[][]> {

    const bufferStart = Date.now();

    const buffer =
        await file.arrayBuffer();

    console.log(
        "[FTP Excel Reader] arrayBuffer:",
        Date.now() - bufferStart,
        "ms",
    );

    const readStart = Date.now();

    const workbook =
        XLSX.read(buffer);

    console.log(
        "[FTP Excel Reader] XLSX.read:",
        Date.now() - readStart,
        "ms",
    );

    const worksheet =
        workbook.Sheets["BTSinfo"];

    if (!worksheet) {
        throw new Error(
            'Sheet "BTSinfo" not found in Excel file.',
        );
    }

    const jsonStart = Date.now();

    const rows =
        XLSX.utils.sheet_to_json<any[]>(
            worksheet,
            {
                header: 1,
                blankrows: false,
            },
        );

    console.log(
        "[FTP Excel Reader] sheet_to_json:",
        Date.now() - jsonStart,
        "ms",
    );

    return rows;
}