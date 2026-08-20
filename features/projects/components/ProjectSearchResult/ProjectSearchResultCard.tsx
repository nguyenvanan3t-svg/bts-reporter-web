import type { ProjectSearchResult } from "../../types";
import Link from "next/link";

interface Props {
    item: ProjectSearchResult;

    onClick?: () => void;
}

export default function ProjectSearchResultCard({
    item,
    onClick,
}: Props) {
    return (
        <div
            style={{
                borderBottom: "1px solid #E5E7EB",
                background: "#FFFFFF",
                transition: "all .2s ease",
            }}
        >
            <Link
                href={`/projects/${item.projectId}`}
                onClick={onClick}
                style={{
                    display: "block",
                    padding: "16px 18px",
                    textDecoration: "none",
                    color: "inherit",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 12,
                                color: "#64748B",
                                fontWeight: 600,
                            }}
                        >
                            {item.projectCode}
                        </div>

                        <div
                            style={{
                                marginTop: 2,
                                fontWeight: 700,
                                color: "#111827",
                                fontSize: 15,
                            }}
                        >
                            {item.projectName}
                        </div>

                        <div
                            style={{
                                marginTop: 4,
                                color: "#64748B",
                                fontSize: 13,
                            }}
                        >
                            Customer • {item.customer}
                        </div>
                    </div>

                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <div
                            style={{
                                fontWeight: 700,
                                color: "#111827",
                            }}
                        >
                            {item.year}
                        </div>

                        <div
                            style={{
                                marginTop: 6,
                                fontSize: 12,
                                color: "#16A34A",
                                background: "#DCFCE7",
                                padding: "3px 8px",
                                borderRadius: 999,
                                display: "inline-block",
                            }}
                        >
                            Active
                        </div>
                    </div>
                </div>
            </Link>

            <Link
                href={`/stations/${item.stationId}`}
                style={{
                    display: "block",
                    padding: "0 18px 16px 18px",
                    color: "#2563EB",
                    fontSize: 13,
                    textDecoration: "none",
                }}
            >
                Station • {item.stationCode}
            </Link>
        </div>
    );
}