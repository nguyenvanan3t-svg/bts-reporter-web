import {
    type NextRequest,
    NextResponse,
} from "next/server";

import { createServerClient } from "@supabase/ssr";

export async function proxy(
    request: NextRequest,
) {
    let response =
        NextResponse.next({
            request,
        });

    const supabase =
        createServerClient(
            process.env
                .NEXT_PUBLIC_SUPABASE_URL!,
            process.env
                .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },

                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(
                            ({
                                name,
                                value,
                            }) => {
                                request.cookies.set(
                                    name,
                                    value,
                                );
                            },
                        );

                        response =
                            NextResponse.next({
                                request,
                            });

                        cookiesToSet.forEach(
                            ({
                                name,
                                value,
                                options,
                            }) => {
                                response.cookies.set(
                                    name,
                                    value,
                                    options,
                                );
                            },
                        );
                    },
                },
            },
        );

    const { data } =
        await supabase.auth.getClaims();

    const pathname =
        request.nextUrl.pathname;

    const isLoggedIn =
        Boolean(data?.claims);

    const isLoginPage =
        pathname === "/";

    const isProtectedPage =
        pathname === "/projects" ||
        pathname.startsWith(
            "/projects/",
        ) ||
        pathname === "/stations" ||
        pathname.startsWith(
            "/stations/",
        );

    if (
        !isLoggedIn &&
        isProtectedPage
    ) {
        return NextResponse.redirect(
            new URL(
                "/",
                request.url,
            ),
        );
    }

    if (
        isLoggedIn &&
        isLoginPage
    ) {
        return NextResponse.redirect(
            new URL(
                "/projects",
                request.url,
            ),
        );
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};