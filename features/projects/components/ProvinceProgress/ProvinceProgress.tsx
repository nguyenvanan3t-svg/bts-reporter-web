"use client";

import {
    Fragment,
    useMemo,
} from "react";

import type { Station } from "@/features/stations/types";
import type { StationFtpScanResult } from "@/lib/ftp/types";

type Props = {
    stations: Station[];
    ftpResults: Record<string, StationFtpScanResult>;
    ftpScanned: boolean;
};

type ProvinceProgressItem = {
    province: string;
    totalStations: number;
    survey: number;
    word: number;
    visio: number;
    pdf: number;
};

function ProgressBar({
    value,
    total,
    color,
}: {
    value: number;
    total: number;
    color: string;
}) {
    const percentage =
        total > 0
            ? Math.round((value / total) * 1000) / 10
            : 0;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minWidth: 120,
            }}
        >
            <div
                style={{
                    flex: 1,
                    height: 5,
                    background: "#e2e8f0",
                    borderRadius: 999,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: color,
                        borderRadius: 999,
                    }}
                />
            </div>

            <span
                style={{
                    width: 42,
                    textAlign: "right",
                    fontSize: 12,
                    color: "#334155",
                }}
            >
                {percentage}%
            </span>
        </div>
    );
}

function ProgressCells({
    value,
    total,
    color,
    stickyBottom = false,
}: {
    value: number;
    total: number;
    color: string;
    stickyBottom?: boolean;
}) {
    const percentage =
        total > 0
            ? Math.round(
                  (value / total) * 1000,
              ) / 10
            : 0;

    return (
        <>
            <td
                style={{
                    ...(stickyBottom
                        ? {
                              position: "sticky",
                              bottom: 0,
                              zIndex: 2,
                              background: "#f8fafc",
                              borderTop: "1px solid #cbd5e1",
                          }
                        : {}),
                    padding: "6px 8px",
                    textAlign: "center",
                    borderRight:
                        "1px solid #e2e8f0",
                    borderBottom:
                        "1px solid #e2e8f0",
                }}
            >
                {value}
            </td>

            <td
                style={{
                    ...(stickyBottom
                        ? {
                              position: "sticky",
                              bottom: 0,
                              zIndex: 2,
                              background: "#f8fafc",
                              borderTop: "1px solid #cbd5e1",
                          }
                        : {}),
                    padding: "6px 8px",
                    borderRight:
                        "1px solid #e2e8f0",
                    borderBottom:
                        "1px solid #e2e8f0",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            height: 5,
                            background:
                                "#e2e8f0",
                            borderRadius: 999,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${percentage}%`,
                                height: "100%",
                                background: color,
                                borderRadius: 999,
                            }}
                        />
                    </div>

                    <span
                        style={{
                            width: 36,
                            textAlign: "right",
                            whiteSpace: "nowrap",
                            fontSize: 12,
                        }}
                    >
                        {percentage}%
                    </span>
                </div>
            </td>
        </>
    );
}

export default function ProvinceProgress({
    stations,
    ftpResults,
    ftpScanned,
}: Props) {
    const provinceProgress = useMemo(() => {
        const map = new Map<
            string,
            ProvinceProgressItem
        >();

        for (const station of stations) {
            const province =
                station.province?.trim() ||
                "Unknown";

            let item = map.get(province);

            if (!item) {
                item = {
                    province,
                    totalStations: 0,
                    survey: 0,
                    word: 0,
                    visio: 0,
                    pdf: 0,
                };

                map.set(province, item);
            }

            item.totalStations += 1;

            if (!ftpScanned) {
                continue;
            }

            const result =
                ftpResults[station.code];

            if (!result) {
                continue;
            }

            if (
                result.survey.status ===
                "FOUND"
            ) {
                item.survey += 1;
            }

            if (
                result.word.status ===
                "FOUND"
            ) {
                item.word += 1;
            }

            if (
                result.visio.status ===
                "FOUND"
            ) {
                item.visio += 1;
            }

            if (
                result.pdf.status ===
                "FOUND"
            ) {
                item.pdf += 1;
            }
        }

        return Array.from(
            map.values(),
        ).sort(
            (a, b) =>
                b.totalStations -
                a.totalStations,
        );
    }, [
        stations,
        ftpResults,
        ftpScanned,
    ]);

    const totalProgress = useMemo(() => {
        return provinceProgress.reduce(
            (total, item) => ({
                totalStations:
                    total.totalStations +
                    item.totalStations,
                survey:
                    total.survey +
                    item.survey,
                word:
                    total.word +
                    item.word,
                visio:
                    total.visio +
                    item.visio,
                pdf:
                    total.pdf +
                    item.pdf,
            }),
            {
                totalStations: 0,
                survey: 0,
                word: 0,
                visio: 0,
                pdf: 0,
            },
        );
    }, [provinceProgress]);

    // UI only: keep the province section compact when there are many provinces.
    // The table remains a single table so all columns stay aligned.
    const shouldScrollProvinces = provinceProgress.length > 5;

    return (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    padding: "16px 16px 10px",
                    borderBottom: "1px solid #e2e8f0",
                }}
            >
                <h2
                    style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#0f172a",
                    }}
                >
                    PROVINCE PROGRESS ({provinceProgress.length})
                </h2>
            </div>

            <div
                style={{
                    overflowX: "auto",
                    overflowY: shouldScrollProvinces ? "auto" : "visible",
                    maxHeight: shouldScrollProvinces ? 300 : undefined,
                    scrollbarGutter: shouldScrollProvinces
                        ? "stable"
                        : undefined,
                }}
            >
                <table
                    style={{
                        width: "100%",
                        minWidth: 760,
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                        fontSize: 13,
                        color: "#0f172a",
                    }}
                >
                    <colgroup>
                        <col style={{ width: 36 }} />
                        <col style={{ width: 110 }} />
                        <col style={{ width: 78 }} />
                        <col style={{ width: 58 }} />
                        <col style={{ width: 105 }} />
                        <col style={{ width: 58 }} />
                        <col style={{ width: 105 }} />
                        <col style={{ width: 58 }} />
                        <col style={{ width: 105 }} />
                        <col style={{ width: 58 }} />
                        <col style={{ width: 105 }} />
                    </colgroup>

                    <thead>
                        <tr style={{ background: "#f8fafc" }}>
                            <th rowSpan={2} style={{
                                position: "sticky", top: 0, zIndex: 3,
                                padding: "7px 8px", textAlign: "center",
                                verticalAlign: "middle", background: "#f8fafc",
                                borderRight: "1px solid #e2e8f0",
                                borderBottom: "1px solid #e2e8f0",
                                fontWeight: 700,
                            }}>#</th>

                            <th rowSpan={2} style={{
                                position: "sticky", top: 0, zIndex: 3,
                                padding: "7px 8px", textAlign: "left",
                                verticalAlign: "middle", background: "#f8fafc",
                                borderRight: "1px solid #e2e8f0",
                                borderBottom: "1px solid #e2e8f0",
                                fontWeight: 700,
                            }}>Province</th>

                            <th rowSpan={2} style={{
                                position: "sticky", top: 0, zIndex: 3,
                                padding: "7px 8px", textAlign: "center",
                                verticalAlign: "middle", background: "#f8fafc",
                                borderRight: "1px solid #e2e8f0",
                                borderBottom: "1px solid #e2e8f0",
                                fontWeight: 700,
                            }}>Total<br />Stations</th>

                            {["Survey", "Word", "Visio", "PDF"].map((label) => (
                                <th key={label} colSpan={2} style={{
                                    position: "sticky", top: 0, zIndex: 3,
                                    padding: "7px 8px", textAlign: "center",
                                    background: "#f8fafc",
                                    borderRight: "1px solid #e2e8f0",
                                    borderBottom: "1px solid #e2e8f0",
                                    fontWeight: 700,
                                }}>{label}</th>
                            ))}
                        </tr>

                        <tr style={{ background: "#f8fafc" }}>
                            {["Survey", "Word", "Visio", "PDF"].map((label) => (
                                <Fragment key={`${label}-subheader`}>
                                    <th style={{
                                        position: "sticky", top: 33, zIndex: 3,
                                        padding: "6px 8px", textAlign: "center",
                                        background: "#f8fafc",
                                        borderRight: "1px solid #e2e8f0",
                                        borderBottom: "1px solid #e2e8f0",
                                        fontSize: 11, fontWeight: 600,
                                        color: "#475569",
                                    }}>Done</th>

                                    <th style={{
                                        position: "sticky", top: 33, zIndex: 3,
                                        padding: "6px 8px", textAlign: "center",
                                        background: "#f8fafc",
                                        borderRight: "1px solid #e2e8f0",
                                        borderBottom: "1px solid #e2e8f0",
                                        fontSize: 11, fontWeight: 600,
                                        color: "#475569",
                                    }}>%</th>
                                </Fragment>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {provinceProgress.map((item, index) => (
                            <tr
                                key={item.province}
                                style={{
                                    background:
                                        index % 2 === 0 ? "#ffffff" : "#fafafa",
                                }}
                            >
                                <td style={{
                                    padding: "7px 8px", textAlign: "center",
                                    borderRight: "1px solid #e2e8f0",
                                    borderBottom: "1px solid #e2e8f0",
                                }}>{index + 1}</td>

                                <td style={{
                                    padding: "7px 8px", textAlign: "left",
                                    borderRight: "1px solid #e2e8f0",
                                    borderBottom: "1px solid #e2e8f0",
                                    fontWeight: 500,
                                }}>{item.province}</td>

                                <td style={{
                                    padding: "7px 8px", textAlign: "center",
                                    borderRight: "1px solid #e2e8f0",
                                    borderBottom: "1px solid #e2e8f0",
                                }}>{item.totalStations}</td>

                                <ProgressCells
                                    value={item.survey}
                                    total={item.totalStations}
                                    color="#16a34a"
                                />
                                <ProgressCells
                                    value={item.word}
                                    total={item.totalStations}
                                    color="#2563eb"
                                />
                                <ProgressCells
                                    value={item.visio}
                                    total={item.totalStations}
                                    color="#9333ea"
                                />
                                <ProgressCells
                                    value={item.pdf}
                                    total={item.totalStations}
                                    color="#f97316"
                                />
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr style={{
                            background: "#f8fafc",
                            fontWeight: 700,
                        }}>
                            <td style={{
                                position: "sticky", bottom: 0, zIndex: 2,
                                padding: "7px 8px", textAlign: "center",
                                background: "#f8fafc",
                                borderRight: "1px solid #e2e8f0",
                                borderTop: "1px solid #cbd5e1",
                            }}>-</td>

                            <td style={{
                                position: "sticky", bottom: 0, zIndex: 2,
                                padding: "7px 8px", textAlign: "left",
                                background: "#f8fafc",
                                borderRight: "1px solid #e2e8f0",
                                borderTop: "1px solid #cbd5e1",
                                fontWeight: 700,
                            }}>Total</td>

                            <td style={{
                                position: "sticky", bottom: 0, zIndex: 2,
                                padding: "7px 8px", textAlign: "center",
                                background: "#f8fafc",
                                borderRight: "1px solid #e2e8f0",
                                borderTop: "1px solid #cbd5e1",
                            }}>{totalProgress.totalStations}</td>

                            <ProgressCells
                                value={totalProgress.survey}
                                total={totalProgress.totalStations}
                                color="#16a34a"
                                stickyBottom
                            />
                            <ProgressCells
                                value={totalProgress.word}
                                total={totalProgress.totalStations}
                                color="#2563eb"
                                stickyBottom
                            />
                            <ProgressCells
                                value={totalProgress.visio}
                                total={totalProgress.totalStations}
                                color="#9333ea"
                                stickyBottom
                            />
                            <ProgressCells
                                value={totalProgress.pdf}
                                total={totalProgress.totalStations}
                                color="#f97316"
                                stickyBottom
                            />
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}