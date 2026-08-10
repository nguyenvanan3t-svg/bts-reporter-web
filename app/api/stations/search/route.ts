import { NextRequest, NextResponse } from "next/server";

import {
    searchByCode,
} from "@/features/stations/service";

export async function GET(
    request: NextRequest,
) {

    const code =
        request.nextUrl.searchParams.get("code");

    if (!code) {

        return NextResponse.json(
            {
                message: "code is required",
            },
            {
                status: 400,
            },
        );

    }

    try {

        const result =
            await searchByCode(code);

        return NextResponse.json(result);

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : JSON.stringify(error),
            },
            {
                status: 500,
            },
        );

    }

}