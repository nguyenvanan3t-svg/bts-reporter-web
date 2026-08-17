import "server-only";
import { Client } from "basic-ftp";

export async function connectFtp(): Promise<Client> {
    const host = process.env.FTP_HOST;
    const port = Number(process.env.FTP_PORT);
    const user = process.env.FTP_USER;
    const password = process.env.FTP_PASSWORD;

    if (!host || !port || !user || !password) {
        throw new Error(
            "FTP configuration is missing. Check FTP_HOST, FTP_PORT, FTP_USER and FTP_PASSWORD."
        );
    }

    const client = new Client();

    client.ftp.verbose = true;

    await client.access({
        host,
        port,
        user,
        password,
        secure: false,
    });

    return client;
}