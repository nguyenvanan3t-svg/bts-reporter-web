"use client";

import { Button } from "@/components/Button";
import StationList from "../StationList/StationList";
import type { Station } from "@/features/stations/types";

type Props = {
    open: boolean;

    stations: Station[];

    onClose: () => void;

    onDelete?: (
        stationId: string,
    ) => void;
};

export default function StationListDialog({
    open,
    stations,
    onClose,
    onDelete,
}: Props) {
    if (!open) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.35)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
            }}
        >
            <div
                style={{
                    background: "#fff",
                    width: 1100,
                    maxWidth: "95vw",
                    height: "80vh",
                    borderRadius: 8,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <h3
                    style={{
                        marginTop: 0,
                        marginBottom: 16,
                    }}
                >
                    Station List ({stations.length})
                </h3>

                <div
                    style={{
                        flex: 1,
                        overflow: "auto",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                    }}
                >
                    <StationList
                        stations={stations}
                        onDelete={onDelete}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 20,
                    }}
                >
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}