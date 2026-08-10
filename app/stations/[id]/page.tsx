import StationLayout
from "@/features/stations/components/StationLayout";
import Card from "@/components/ui/Card";
import StationInformation
from "@/features/stations/components/StationInformation";
import {
    getById,
} from "@/features/stations/service";
import { ResourceCard } from "@/components/Station/ResourceCard";
import {
    ResourceStatusTable,
} from "@/components/Station";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function StationDetailPage({
    params,
}: Props) {

    const { id } = await params;
    const station = await getById(id);

    const resources = [
        {
            resource: "Survey",
            status: "FOUND" as const,
            fileName: "survey.json",
            size: "12 KB",
            updated: "05/08/2026",
        },
        {
            resource: "Word",
            status: "MISSING" as const,
            fileName: "-",
            size: "-",
            updated: "-",
        },
        {
            resource: "Visio",
            status: "FOUND" as const,
            fileName: "DBN0075-13.vsdx",
            size: "3.5 MB",
            updated: "05/08/2026",
        },
        {
            resource: "PDF",
            status: "FOUND" as const,
            fileName: "DBN0075-13.pdf",
            size: "2.2 MB",
            updated: "05/08/2026",
        },
    ];

    return (

        <main
            style={{
                padding: 32,
                background: "#f8fafc",
                minHeight: "100vh",
            }}
        >

            <div
                style={{
                    marginBottom: 24,
                }}
            >

                <div
                    style={{
                        color: "#64748b",
                        fontSize: 14,
                        marginBottom: 8,
                    }}
                >
                    Home &gt; Projects &gt; Station
                </div>

                <h1
                    style={{
                        margin: 0,
                        fontSize: 36,
                        fontWeight: 700,
                    }}
                >
                    Station Detail
                </h1>

                <div
                    style={{
                        marginTop: 8,
                        color: "#64748b",
                        fontSize: 18,
                    }}
                >
                    Station ID: {station.code}
                </div>

                <div
                    style={{
                        marginTop: 14,
                        color: "#64748b",
                        fontSize: 15,
                        lineHeight: 1.6,
                        maxWidth: 720,
                    }}
                >
                    Monitor survey progress and engineering documents stored on the FTP
                    server. Download existing resources or upload updated files for this
                    station.
                </div>

            </div>

            <StationLayout

                left={

                    <Card>

                        <StationInformation
                            code={station.code}
                            project={station.project?.name ?? "-"}
                            projectCode={station.project?.code ?? "-"}
                            province={station.province}
                            address={station.address}
                            status={station.status}
                            createdAt={station.createdAt}
                            updatedAt={station.updatedAt}
                        />

                    </Card>

                }

                right={

                    <>

                        <div
                            style={{
                                marginBottom: 12,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 22,
                                    fontWeight: 700,
                                    marginBottom: 6,
                                }}
                            >
                                Resource Monitor
                            </div>

                            <div
                                style={{
                                    color: "#64748b",
                                    fontSize: 14,
                                }}
                            >
                                Current survey and document resources detected on FTP server.
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 20,
                            }}
                        >

                            <ResourceCard
                                title="Survey"
                                found={true}
                                fileName="survey.json"
                            />

                            <ResourceCard
                                title="Word"
                                found={false}
                            />

                            <ResourceCard
                                title="Visio"
                                found={true}
                                fileName="DBN0075-13.vsdx"
                            />

                            <ResourceCard
                                title="PDF"
                                found={true}
                                fileName="DBN0075-13.pdf"
                            />

                        </div>

                        <div
                            style={{
                                height: 24,
                            }}
                        />

                        <ResourceStatusTable
                            items={resources}
                        />

                    </>

                }

            />

        </main>

    );

}