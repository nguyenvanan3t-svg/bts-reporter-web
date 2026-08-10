import { notFound } from "next/navigation";

import { ProjectRepository } from "@/features/projects/repository";
import { ProjectService } from "@/features/projects/service";
import {
    loadStations,
} from "@/features/stations/service";

import ProjectStations
from "@/features/projects/components/ProjectStations/ProjectStations";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";
import ProjectHeader
from "@/features/projects/components/ProjectHeader";
import ProjectLayout from "@/features/projects/components/ProjectLayout";
import {
    ProjectInformation,
} from "@/features/projects/components/ProjectInformation";
import {
    StationSummary,
} from "@/features/projects/components/StationSummary";
import {
    ProjectMetrics,
} from "@/features/projects/components/ProjectMetrics";


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

                padding: 40,

                background: "#f5f7fb",

                minHeight: "100vh",

            }}
        >

            <Section
                title="Project Detail"
            >

                <ProjectHeader
                    project={project}
                />

                <div
                    style={{
                        height: 24,
                    }}
                />

                <ProjectMetrics
                    total={stations.length}
                    survey={0}
                    word={0}
                    visio={0}
                    pdf={0}
                />

                <ProjectLayout

                    left={

                        <>

                            <Card>

                                <ProjectInformation
                                    code={project.code}
                                    name={project.name}
                                    customer={project.customer}
                                    year={project.year}
                                    status={project.status}
                                    description={project.description}
                                />

                            </Card>

                        </>

                    }

                    right={

                        <Card>

                            <ProjectStations
                                project={project}
                                stations={stations}
                            />

                        </Card>

                    }

                />

            </Section>

        </main>

    );
}