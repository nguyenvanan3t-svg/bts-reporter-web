import StationLayout
from "@/features/stations/components/StationLayout";
import Card from "@/components/ui/Card";
import StationInformation
from "@/features/stations/components/StationInformation";
import {
    getById,
    loadFtpResources,
} from "@/features/stations/service";
import StationFtpResources from "@/features/stations/components/StationFtpResources";

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

    const ftpResources =
        await loadFtpResources(station.id);

    const stationStatus =
        ftpResources.pdf.status === "FOUND"
            ? "COMPLETED"
            : "PENDING";
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
                        color: "#2563eb",
                        fontSize: 15,
                        marginBottom: 8,
                    }}
                >
                    <a
                        href="/"
                        style={{
                            color: "#2563eb",
                            textDecoration: "none",
                        }}
                    >
                        Home
                    </a>

                    {" > "}

                    <a
                        href="/projects"
                        style={{
                            color: "#2563eb",
                            textDecoration: "none",
                        }}
                    >
                        Projects
                    </a>

                    {" > "}

                    <a
                        href={`/projects/${station.projectId}`}
                        style={{
                            color: "#2563eb",
                            textDecoration: "none",
                        }}
                    >
                        {station.project?.name ?? "Project"}
                    </a>

                    {" > "}

                    <span
                        style={{
                            color: "#1e293b",
                            fontWeight: 600,
                        }}
                    >
                        {station.code}
                    </span>
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
                            excelSource={station.excelSource}
                            status={stationStatus}
                            createdAt={station.createdAt}
                            updatedAt={station.updatedAt}
                        />

                    </Card>

                }

                right={

                    <StationFtpResources
                        stationId={station.id}
                        projectId={station.projectId}
                        stationCode={station.code}
                    />

                }

            />

        </main>

    );

}