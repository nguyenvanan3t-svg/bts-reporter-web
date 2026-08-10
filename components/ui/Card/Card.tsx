import type {
    CSSProperties,
    ReactNode,
} from "react";

interface CardProps {

    children: ReactNode;

    title?: string;

    style?: CSSProperties;

}

export default function Card({
    children,
    title,
    style,
}: CardProps) {

    return (

        <div
            style={{

                background: "#ffffff",

                border: "1px solid #e5e7eb",

                borderRadius: 10,

                padding: 20,

                boxShadow:
                    "0 1px 3px rgba(0,0,0,.06)",

                ...style,

            }}
        >

            {title && (

                <h3
                    style={{

                        marginTop: 0,

                        marginBottom: 20,

                        fontSize: 18,

                        color: "#111827",

                    }}
                >
                    {title}
                </h3>

            )}

            {children}

        </div>

    );

}