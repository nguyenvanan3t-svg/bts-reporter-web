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
            className="
                grid
                grid-cols-1
                gap-4
                items-start
                lg:grid-cols-[360px_minmax(0,1fr)]
                lg:gap-6
            "
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