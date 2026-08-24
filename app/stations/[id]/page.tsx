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
import StationHeader
from "@/features/stations/components/StationHeader";

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

            <StationHeader
                stationCode={station.code}
                projectId={station.projectId}
                projectName={station.project?.name ?? "Project"}
                province={station.province}
                status={stationStatus}
            />

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