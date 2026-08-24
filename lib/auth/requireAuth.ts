import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type AuthResult =
    | {
        authenticated: false;
        response: NextResponse;
    }
    | {
        authenticated: true;
        claims: unknown;
    };

export async function requireAuth(): Promise<AuthResult> {
    const supabase =
        await createClient();

    const { data, error } =
        await supabase.auth.getClaims();

    if (
        error ||
        !data?.claims
    ) {
        return {
            authenticated: false,
            response: NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized.",
                },
                { status: 401 },
            ),
        };
    }

    return {
        authenticated: true,
        claims: data.claims,
    };
}