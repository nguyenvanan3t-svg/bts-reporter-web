"use client";

type ScanHistoryItem = {
    id: string;
    startedAt: string;
    completedAt: string | null;
    status:
        | "RUNNING"
        | "COMPLETED"
        | "FAILED";
    totalStations: number;
    surveyFound: number;
    wordFound: number;
    visioFound: number;
    pdfFound: number;
};

type Props = {
    history: ScanHistoryItem[];
};

const CHART_WIDTH = 280;
const CHART_HEIGHT = 145;

const PADDING_LEFT = 28;
const PADDING_RIGHT = 6;
const PADDING_TOP = 8;
const PADDING_BOTTOM = 20;

const COLORS = {
    survey: "#16a34a",
    word: "#2563eb",
    visio: "#9333ea",
    pdf: "#f97316",
};

function getPercentage(
    value: number,
    total: number,
) {
    if (total <= 0) {
        return 0;
    }

    return (
        (value / total) *
        100
    );
}

function buildPoints(
    values: number[],
) {
    if (values.length === 0) {
        return "";
    }

    const chartWidth =
        CHART_WIDTH -
        PADDING_LEFT -
        PADDING_RIGHT;

    const chartHeight =
        CHART_HEIGHT -
        PADDING_TOP -
        PADDING_BOTTOM;

    return values
        .map((value, index) => {
            const x =
                PADDING_LEFT +
                (values.length === 1
                    ? chartWidth / 2
                    : (index /
                          (values.length - 1)) *
                      chartWidth);

            const y =
                PADDING_TOP +
                chartHeight -
                (value / 100) *
                    chartHeight;

            return `${x},${y}`;
        })
        .join(" ");
}

function formatTime(
    value: string,
) {
    const date = new Date(value);

    return date.toLocaleTimeString(
        "vi-VN",
        {
            hour: "2-digit",
            minute: "2-digit",
        },
    );
}

export default function ProjectFtpProgressChart({
    history,
}: Props) {
    const items = [...history]
        .slice(0, 5)
        .reverse();

    if (items.length === 0) {
        return (
            <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                Chưa có dữ liệu lịch sử scan.
            </div>
        );
    }

    const surveyValues =
        items.map((item) =>
            getPercentage(
                item.surveyFound,
                item.totalStations,
            ),
        );

    const wordValues =
        items.map((item) =>
            getPercentage(
                item.wordFound,
                item.totalStations,
            ),
        );

    const visioValues =
        items.map((item) =>
            getPercentage(
                item.visioFound,
                item.totalStations,
            ),
        );

    const pdfValues =
        items.map((item) =>
            getPercentage(
                item.pdfFound,
                item.totalStations,
            ),
        );

    const series = [
        {
            name: "Survey",
            color: COLORS.survey,
            values: surveyValues,
        },
        {
            name: "Word",
            color: COLORS.word,
            values: wordValues,
        },
        {
            name: "Visio",
            color: COLORS.visio,
            values: visioValues,
        },
        {
            name: "PDF",
            color: COLORS.pdf,
            values: pdfValues,
        },
    ];

    const chartWidth =
        CHART_WIDTH -
        PADDING_LEFT -
        PADDING_RIGHT;

    const chartHeight =
        CHART_HEIGHT -
        PADDING_TOP -
        PADDING_BOTTOM;

    return (
        <div className="w-full">
            <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]">
                {series.map(
                    (item) => (
                        <div
                            key={item.name}
                            className="flex items-center gap-1"
                        >
                            <span
                                className="h-1.5 w-4 rounded-full"
                                style={{
                                    backgroundColor:
                                        item.color,
                                }}
                            />

                            <span>
                                {item.name}
                            </span>
                        </div>
                    ),
                )}
            </div>

            <svg
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                className="h-auto w-full"
                role="img"
                aria-label="Tiến độ theo thời gian"
            >
                {[0, 20, 40, 60, 80, 100].map(
                    (value) => {
                        const y =
                            PADDING_TOP +
                            chartHeight -
                            (value / 100) *
                                chartHeight;

                        return (
                            <g
                                key={value}
                            >
                                <line
                                    x1={
                                        PADDING_LEFT
                                    }
                                    y1={y}
                                    x2={
                                        CHART_WIDTH -
                                        PADDING_RIGHT
                                    }
                                    y2={y}
                                    stroke="currentColor"
                                    strokeOpacity={
                                        0.08
                                    }
                                />

                                <text
                                    x={
                                        PADDING_LEFT -
                                        5
                                    }
                                    y={
                                        y +
                                        3
                                    }
                                    textAnchor="end"
                                    fontSize="9"
                                    fill="currentColor"
                                    opacity="0.55"
                                >
                                    {value}%
                                </text>
                            </g>
                        );
                    },
                )}

                {series.map(
                    (item) => (
                        <g
                            key={item.name}
                        >
                            <polyline
                                points={buildPoints(
                                    item.values,
                                )}
                                fill="none"
                                stroke={
                                    item.color
                                }
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {item.values.map(
                                (
                                    value,
                                    index,
                                ) => {
                                    const x =
                                        PADDING_LEFT +
                                        (items.length ===
                                        1
                                            ? chartWidth /
                                              2
                                            : (index /
                                                  (items.length -
                                                      1)) *
                                              chartWidth);

                                    const y =
                                        PADDING_TOP +
                                        chartHeight -
                                        (value /
                                            100) *
                                            chartHeight;

                                    return (
                                        <circle
                                            key={`${item.name}-${index}`}
                                            cx={x}
                                            cy={y}
                                            r="2.5"
                                            fill={
                                                item.color
                                            }
                                        />
                                    );
                                },
                            )}
                        </g>
                    ),
                )}

                {items.map(
                    (
                        item,
                        index,
                    ) => {
                        const x =
                            PADDING_LEFT +
                            (items.length ===
                            1
                                ? chartWidth /
                                  2
                                : (index /
                                      (items.length -
                                          1)) *
                                  chartWidth);

                        return (
                            <text
                                key={
                                    item.id
                                }
                                x={x}
                                y={
                                    CHART_HEIGHT -
                                    7
                                }
                                textAnchor="middle"
                                fontSize="9"
                                fill="currentColor"
                                opacity="0.6"
                            >
                                {formatTime(
                                    item.startedAt,
                                )}
                            </text>
                        );
                    },
                )}
            </svg>
        </div>
    );
}