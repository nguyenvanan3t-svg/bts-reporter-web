"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/Button";
import type {
    Project,
    ProjectStatus,
} from "@/features/projects/types";
import { projectService } from "@/services/container";

type Props = {
    project: Project;
    onCancel: () => void;
    onSaved: () => void;
};

export default function ProjectEditForm({
    project,
    onCancel,
    onSaved,
}: Props) {
    const router = useRouter();

    const [form, setForm] = useState({
        code: project.code,
        name: project.name,
        customer: project.customer ?? "",
        year: project.year.toString(),
        status: project.status,
        description: project.description ?? "",
    });

    const [isSaving, setIsSaving] = useState(false);

    async function handleUpdateProject() {
        if (!form.code.trim()) {
            toast.warning("Project code is required.");
            return;
        }

        if (!form.name.trim()) {
            toast.warning("Project name is required.");
            return;
        }

        const year = Number(form.year);

        if (!Number.isInteger(year) || year <= 0) {
            toast.warning("Project year is invalid.");
            return;
        }

        try {
            setIsSaving(true);

            await projectService.update(project.id, {
                code: form.code.trim(),
                name: form.name.trim(),
                customer: form.customer.trim(),
                year,
                status: form.status,
                description: form.description.trim(),
            });

            toast.success("Project updated successfully.");

            onSaved();
            router.refresh();
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "PROJECT_CODE_EXISTS"
            ) {
                toast.error("Project code already exists.");
            } else if (
                error instanceof Error &&
                error.message === "Archived projects cannot be modified."
            ) {
                toast.error("Archived projects cannot be modified.");
            } else if (
                error instanceof Error &&
                error.message === "Project not found."
            ) {
                toast.error("Project not found.");
            } else {
                toast.error("Failed to update project.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    function handleCancel() {
        onCancel();
    }

    return (
        <div
            style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: 18,
                padding: 24,
                boxShadow: "0 6px 18px rgba(15,23,42,.05)",
            }}
        >
            <div
                style={{
                    marginBottom: 26,
                }}
            >
                <div
                    style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#111827",
                    }}
                >
                    Edit Project
                </div>

                <div
                    style={{
                        marginTop: 6,
                        fontSize: 14,
                        color: "#64748B",
                        lineHeight: 1.6,
                    }}
                >
                    Update project information. All project fields can be
                    modified.
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                }}
            >
                <div>
                    <div style={labelStyle}>
                        Project Code *
                    </div>

                    <input
                        placeholder="Enter project code"
                        value={form.code}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                code: e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <div style={labelStyle}>
                        Project Name *
                    </div>

                    <input
                        placeholder="Enter project name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                name: e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <div style={labelStyle}>
                        Customer
                    </div>

                    <input
                        placeholder="Enter customer"
                        value={form.customer}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                customer: e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <div style={labelStyle}>
                        Year
                    </div>

                    <input
                        type="number"
                        placeholder="2026"
                        value={form.year}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                year: e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>

                <div>
                    <div style={labelStyle}>
                        Status
                    </div>

                    <select
                        value={form.status}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                status: e.target.value as ProjectStatus,
                            })
                        }
                        style={inputStyle}
                    >
                        <option value="PLANNING">
                            Planning
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="ARCHIVED">
                            Archived
                        </option>
                    </select>
                </div>

                <div>
                    <div style={labelStyle}>
                        Description
                    </div>

                    <textarea
                        placeholder="Description"
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        style={{
                            ...inputStyle,
                            resize: "none",
                            height: 120,
                            paddingTop: 14,
                        }}
                    />
                </div>

                <div
                    style={{
                        height: 1,
                        background: "#E2E8F0",
                        margin: "6px 0 2px",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 12,
                        marginTop: 18,
                    }}
                >
                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleUpdateProject}
                        disabled={isSaving}
                    >
                        {isSaving
                            ? "Saving..."
                            : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 46,
    padding: "0 14px",
    borderRadius: 10,
    border: "1px solid #CBD5E1",
    fontSize: 14,
    boxSizing: "border-box",
    background: "#FFFFFF",
    color: "#111827",
};