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
}: {
    value: number;
    total: number;
    color: string;
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
                    padding: "8px 10px",
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
                    padding: "8px 10px",
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
                        gap: 10,
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
                            width: 42,
                            textAlign: "right",
                            whiteSpace: "nowrap",
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
                    padding: "14px 16px",
                    borderBottom:
                        "1px solid #e2e8f0",
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
                    PROVINCE PROGRESS (
                    {provinceProgress.length})
                </h2>
            </div>

            <div
                style={{
                    overflowX: "auto",
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        tableLayout: "fixed",
                        fontSize: 13,
                        color: "#0f172a",
                    }}
                >
                    <colgroup>
                        <col style={{ width: 42 }} />
                        <col style={{ width: 125 }} />
                        <col style={{ width: 95 }} />

                        <col style={{ width: 70 }} />
                        <col style={{ width: 135 }} />

                        <col style={{ width: 70 }} />
                        <col style={{ width: 135 }} />

                        <col style={{ width: 70 }} />
                        <col style={{ width: 135 }} />

                        <col style={{ width: 70 }} />
                        <col style={{ width: 135 }} />
                    </colgroup>

                    <thead>
                        <tr
                            style={{
                                background: "#f8fafc",
                            }}
                        >
                            <th
                                rowSpan={2}
                                style={{
                                    padding: "8px 10px",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    borderRight:
                                        "1px solid #e2e8f0",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                    fontWeight: 700,
                                }}
                            >
                                #
                            </th>

                            <th
                                rowSpan={2}
                                style={{
                                    padding: "8px 10px",
                                    textAlign: "left",
                                    verticalAlign: "middle",
                                    borderRight:
                                        "1px solid #e2e8f0",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                    fontWeight: 700,
                                }}
                            >
                                Province
                            </th>

                            <th
                                rowSpan={2}
                                style={{
                                    padding: "8px 10px",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    borderRight:
                                        "1px solid #e2e8f0",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                    fontWeight: 700,
                                }}
                            >
                                Total
                                <br />
                                Stations
                            </th>

                            {[
                                "Survey",
                                "Word",
                                "Visio",
                                "PDF",
                            ].map((label) => (
                                <th
                                    key={label}
                                    colSpan={2}
                                    style={{
                                        padding: "8px 10px",
                                        textAlign: "center",
                                        borderRight:
                                            "1px solid #e2e8f0",
                                        borderBottom:
                                            "1px solid #e2e8f0",
                                        fontWeight: 700,
                                    }}
                                >
                                    {label}
                                </th>
                            ))}
                        </tr>

                        <tr
                            style={{
                                background: "#f8fafc",
                            }}
                        >
                            {[
                                "Survey",
                                "Word",
                                "Visio",
                                "PDF",
                            ].map((label) => (
                                <Fragment
                                    key={`${label}-subheader`}
                                >
                                    <th
                                        style={{
                                            padding:
                                                "6px 8px",
                                            textAlign:
                                                "center",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            borderBottom:
                                                "1px solid #e2e8f0",
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: "#475569",
                                        }}
                                    >
                                        Done
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "6px 8px",
                                            textAlign:
                                                "center",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            borderBottom:
                                                "1px solid #e2e8f0",
                                            fontSize: 11,
                                            fontWeight: 600,
                                            color: "#475569",
                                        }}
                                    >
                                        %
                                    </th>
                                </Fragment>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {provinceProgress.map(
                            (item, index) => (
                                <tr
                                    key={item.province}
                                    style={{
                                        background:
                                            index % 2 === 0
                                                ? "#ffffff"
                                                : "#fafafa",
                                    }}
                                >
                                    <td
                                        style={{
                                            padding: "8px 10px",
                                            textAlign: "center",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            borderBottom:
                                                "1px solid #e2e8f0",
                                        }}
                                    >
                                        {index + 1}
                                    </td>

                                    <td
                                        style={{
                                            padding: "8px 10px",
                                            textAlign: "left",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            borderBottom:
                                                "1px solid #e2e8f0",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {item.province}
                                    </td>

                                    <td
                                        style={{
                                            padding: "8px 10px",
                                            textAlign: "center",
                                            borderRight:
                                                "1px solid #e2e8f0",
                                            borderBottom:
                                                "1px solid #e2e8f0",
                                        }}
                                    >
                                        {item.totalStations}
                                    </td>

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
                            ),
                        )}
                        
                        <tr
                            style={{
                                background: "#f8fafc",
                                fontWeight: 700,
                            }}
                        >
                            <td
                                style={{
                                    padding: "8px 10px",
                                    textAlign: "center",
                                    borderRight:
                                        "1px solid #e2e8f0",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                }}
                            >
                                -
                            </td>

                            <td
                                style={{
                                    padding: "8px 10px",
                                    textAlign: "left",
                                    borderRight:
                                        "1px solid #e2e8f0",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                    fontWeight: 700,
                                }}
                            >
                                Total
                            </td>

                            <td
                                style={{
                                    padding: "8px 10px",
                                    textAlign: "center",
                                    borderRight:
                                        "1px solid #e2e8f0",
                                    borderBottom:
                                        "1px solid #e2e8f0",
                                }}
                            >
                                {totalProgress.totalStations}
                            </td>

                            <ProgressCells
                                value={totalProgress.survey}
                                total={totalProgress.totalStations}
                                color="#16a34a"
                            />

                            <ProgressCells
                                value={totalProgress.word}
                                total={totalProgress.totalStations}
                                color="#2563eb"
                            />

                            <ProgressCells
                                value={totalProgress.visio}
                                total={totalProgress.totalStations}
                                color="#9333ea"
                            />

                            <ProgressCells
                                value={totalProgress.pdf}
                                total={totalProgress.totalStations}
                                color="#f97316"
                            />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}