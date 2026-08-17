import * as XLSX from "xlsx";

export async function readExcel(
    file: File,
): Promise<any[][]> {

    const buffer =
        await file.arrayBuffer();

    const workbook =
        XLSX.read(buffer);

    const worksheet =
        workbook.Sheets["BTSinfo"];

    if (!worksheet) {
        throw new Error(
            'Sheet "BTSinfo" not found in Excel file.',
        );
    }

    return XLSX.utils.sheet_to_json(
        worksheet,
        {
            header: 1,
            blankrows: false,
        },
    );
}