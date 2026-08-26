"use client";

import ProjectSearchResultCard from "../ProjectSearchResult";
import { useEffect, useState } from "react";
import type { ProjectSearchResult } from "../../types";



export default function ProjectSearch() {
    const [keyword, setKeyword] = useState("");

    const [debouncedKeyword, setDebouncedKeyword] =
        useState("");

    const [results, setResults] =
        useState<ProjectSearchResult[]>([]);

    useEffect(() => {

        const timer = setTimeout(() => {

            setDebouncedKeyword(keyword);

        }, 300);

        return () => clearTimeout(timer);

    }, [keyword]);

    useEffect(() => {

        if (!debouncedKeyword.trim()) {

            setResults([]);

            return;

        }

        async function search() {

            const response = await fetch(
                `/api/stations/search?code=${encodeURIComponent(keyword)}`
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            const mapped = data.map((item: any) => ({
                projectId: item.project.id,
                projectCode: item.project.code,
                projectName: item.project.name,
                customer: item.project.customer,
                year: item.project.year,
                stationId: item.id,
                stationCode: item.code,
                stationAddress: item.address,
            }));

            const unique = mapped.filter(
                (
                    item: ProjectSearchResult,
                    index: number,
                    array: ProjectSearchResult[],
                ) =>
                    index ===
                    array.findIndex(
                        (x: ProjectSearchResult) =>
                            x.projectId === item.projectId
                    ),
            );

            setResults(unique);

        }

        search();

    }, [debouncedKeyword]);

    return (
        <div
            style={{
                marginBottom: 24,
                position: "relative",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94A3B8",
                    fontSize: 18,
                    pointerEvents: "none",
                }}
            >
                🔍
            </div>

            <input
                placeholder="Search Station Code..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                    width: "100%",
                    height: 48,
                    padding: "0 18px 0 48px",
                    borderRadius: 12,
                    border: "1px solid #CBD5E1",
                    fontSize: 15,
                    background: "#FFFFFF",
                    boxSizing: "border-box",
                    outline: "none",
                }}
            />
            {keyword.trim() && (
                <div
                    style={{
                        position: "absolute",
                        top: 60,
                        left: 0,
                        width: "min(680px, 100%)",

                        background: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: 14,
                        boxShadow: "0 12px 40px rgba(15,23,42,.12)",
                        overflow: "hidden",
                        zIndex: 100,
                        maxHeight: 320,
                        overflowY: "auto",
                    }}
                >
                    <div
                        style={{
                            padding: "14px 18px",
                            fontWeight: 700,
                            borderBottom: "1px solid #F1F5F9",
                        }}
                    >
                        Search Result
                    </div>

                    {results.length === 0 ? (
                        <div
                            style={{
                                padding: 24,
                                textAlign: "center",
                                color: "#94A3B8",
                            }}
                        >
                            No project found.
                        </div>
                    ) : (
                        results.map((item) => (
                            <ProjectSearchResultCard
                                key={`${item.projectId}-${item.stationCode}`}
                                item={item}
                            />
                        ))
                    )}

                </div>
            )}
        </div>
    );
}