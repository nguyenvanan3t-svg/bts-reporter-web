"use client";

import {
    useTransition,
    type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type NavigationLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    loadingText?: string;
};

export default function NavigationLink({
    href,
    children,
    className,
    style,
    loadingText = "Opening...",
}: NavigationLinkProps) {
    const router = useRouter();

    const [
        isPending,
        startTransition,
    ] = useTransition();

    function handleClick(
        event: React.MouseEvent<HTMLAnchorElement>,
    ) {
        event.preventDefault();

        if (isPending) {
            return;
        }

        startTransition(() => {
            router.push(href);
        });
    }

    return (
        <a
            href={href}
            className={className}
            onClick={handleClick}
            aria-disabled={isPending}
            aria-busy={isPending}
            style={{
                ...style,

                opacity: isPending
                    ? 0.65
                    : 1,

                cursor: isPending
                    ? "default"
                    : "pointer",

                pointerEvents: isPending
                    ? "none"
                    : "auto",

                transform: isPending
                    ? "scale(0.98)"
                    : undefined,

                transition:
                    "opacity .15s ease, transform .08s ease",

                WebkitTapHighlightColor:
                    "transparent",
            }}
        >
            {isPending ? (
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent:
                            "center",
                        gap: 7,
                    }}
                >
                    <span
                        className="button-loading-spinner"
                        aria-hidden="true"
                    />

                    {loadingText}
                </span>
            ) : (
                children
            )}
        </a>
    );
}