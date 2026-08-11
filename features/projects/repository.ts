import { supabase } from "@/lib/supabase";
import type {
    Project,
    CreateProjectDto,
    UpdateProjectDto,
} from "./types";

export class ProjectRepository {
    async getAll() {
        const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", {
            ascending: false,
        });

        if (error) {
        throw error;
        }

        return data;
    }

    async create(dto: CreateProjectDto) {
        const { data, error } = await supabase
            .from("projects")
            .insert({
                    code: dto.code,
                    name: dto.name,
                    customer: dto.customer,
                    year: dto.year,
                    description: dto.description,
                    status: "PLANNING",
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async findByCode(code: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("code", code)
            .maybeSingle();

        if (error) throw error;

        return data;
    }

    async findByName(name: string): Promise<Project | null> {

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("name", name)
            .limit(1);

        if (error) {
            throw error;
        }

        return data.length > 0 ? data[0] : null;
    }

    async findById(id: string): Promise<Project | null> {
        const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

        if (error) {
        throw error;
        }

        return data;
    }

    async update(id: string, dto: UpdateProjectDto) {
        const { data, error } = await supabase
        .from("projects")
        .update({
            code: dto.code,
            name: dto.name,
            customer: dto.customer,
            year: dto.year,
            description: dto.description,
            status: dto.status,
        })
        .eq("id", id)
        .select()
        .single();

        if (error) {
        throw error;
        }

        return data;
    }

    async archive(id: string): Promise<Project> {
        const { data, error } = await supabase
            .from("projects")
            .update({
                status: "ARCHIVED",
            })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (error) {
            throw error;
        }
    }
}
