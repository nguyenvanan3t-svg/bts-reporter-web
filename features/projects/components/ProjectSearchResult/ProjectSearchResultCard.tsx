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
        <Link
            href={`/projects/${item.projectId}`}
            style={{
                textDecoration: "none",
            }}
        >
            <div
                onClick={onClick}
                style={{
                    padding: "16px 18px",
                    borderBottom: "1px solid #E5E7EB",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#FFFFFF",
                    transition: "all .2s ease",
                }}
            >
                <>
                    <div>
                        <>
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
                        </>

                        <div
                            style={{
                                marginTop: 4,
                                color: "#64748B",
                                fontSize: 13,
                            }}
                        >
                            Customer • {item.customer}
                        </div>

                        <div
                            style={{
                                marginTop: 6,
                                color: "#2563EB",
                                fontSize: 13,
                            }}
                        >
                            Station • {item.stationCode}
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
                </>
            </div>
        </Link>
    );
}