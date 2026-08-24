import { notFound } from "next/navigation";

import { ProjectRepository } from "@/features/projects/repository";
import { ProjectService } from "@/features/projects/service";
import {
    loadStations,
} from "@/features/stations/service";

import ProjectStations
from "@/features/projects/components/ProjectStations/ProjectStations";
import Section from "@/components/ui/Section";
import {
    StationSummary,
} from "@/features/projects/components/StationSummary";
import ProjectFtpDashboard
from "@/features/projects/components/ProjectFtpDashboard";


type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProjectDetailPage(
    { params }: Props,
) {
    const { id } = await params;

    const service = new ProjectService(
        new ProjectRepository(),
    );

    const project =
        await service.getById(id);

    if (!project) {
        notFound();
    }

    const stations =
        await loadStations(
            project.id,
        );

    return (

        <main
            style={{
                padding: "10px 10px 10px",
                background: "#f5f7fb",
                minHeight: "100vh",
            }}
        >

            <Section>

                <ProjectFtpDashboard
                    project={project}
                    stations={stations}
                />

            </Section>

        </main>

    );
}