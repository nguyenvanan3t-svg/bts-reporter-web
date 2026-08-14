import type {
    CSSProperties,
    ReactNode,
} from "react";

interface SectionProps {

    title?: string;

    children: ReactNode;

    actions?: ReactNode;

    style?: CSSProperties;

}

export default function Section({

    title,

    actions,

    children,

    style,

}: SectionProps) {

    return (

        <section
            style={{

                marginBottom: 28,

                ...style,

            }}
        >

            {(title || actions) && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 16,
                    }}
                >
                    {title ? (
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 22,
                                color: "#111827",
                            }}
                        >
                            {title}
                        </h2>
                    ) : (
                        <div />
                    )}

                    {actions}
                </div>
            )}

            {children}

        </section>

    );

}