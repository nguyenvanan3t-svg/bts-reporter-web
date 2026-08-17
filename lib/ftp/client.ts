import "server-only";
import { Client } from "basic-ftp";

export async function connectFtp(): Promise<Client> {
    const host = process.env.FTP_HOST;
    const port = Number(process.env.FTP_PORT);
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;

    if (!host || !port || !user || !password) {
        throw new Error(
            "FTP configuration is missing. Check FTP_HOST, FTP_PORT, FTP_USER and FTP_PASSWORD.",
        );
    }

    const client = new Client();

    await client.connect(
        host,
        port,
    );

    await client.login(
        user,
        password,
    );

    /*
     * Giữ binary mode giống useDefaultSettings()
     * để không ảnh hưởng download/upload file.
     */
    await client.send(
        "TYPE I",
    );

    await client.send(
        "STRU F",
    );

    /*
     * FileZilla server đã xác nhận hỗ trợ MLSD.
     * Giữ MLSD làm phương thức LIST chính.
     */
    client.availableListCommands = [
        "MLSD",
        "LIST -a",
        "LIST",
    ];

    return client;
}
