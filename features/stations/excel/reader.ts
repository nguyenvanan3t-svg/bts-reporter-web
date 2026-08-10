import * as XLSX from "xlsx";

export async function readExcel(
    file: File,
): Promise<any[][]> {

    const buffer =
        await file.arrayBuffer();

    const workbook =
        XLSX.read(buffer);

    const firstSheet =
        workbook.SheetNames[0];

    const worksheet =
        workbook.Sheets[firstSheet];

    return XLSX.utils.sheet_to_json(
        worksheet,
        {
            header: 1,
            blankrows: false,
        },
    );
}