import { ReactNode } from "react";

type StationLayoutProps = {

    left: ReactNode;

    right: ReactNode;

};

export default function StationLayout({

    left,

    right,

}: StationLayoutProps) {

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "360px 1fr",
                gap: 24,
                alignItems: "start",
            }}
        >

            <div>

                {left}

            </div>

            <div>

                {right}

            </div>

        </div>

    );

}