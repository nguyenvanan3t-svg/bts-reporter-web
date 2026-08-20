"use client";

import { Button } from "@/components/Button";
import { useState } from "react";
import { projectService } from "@/services/container";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProjectCreateForm() {

    const [form, setForm] = useState({
        code: "",
        name: "",
        customer: "",
        year: new Date().getFullYear().toString(),
        description: "",
    });

    const [isCreating, setIsCreating] = useState(false);

    const router = useRouter();

    function handleReset() {
        setForm({
            code: "",
            name: "",
            customer: "",
            year: new Date().getFullYear().toString(),
            description: "",
        });
    }

    async function handleCreateProject() {

        if (!form.code.trim()) {

            toast.warning("Project code is required.");

            return;

        }

        if (!form.name.trim()) {

            toast.warning("Project name is required.");

            return;

        }

        try {

            setIsCreating(true);

            await projectService.create({
                code: form.code,
                name: form.name,
                customer: form.customer,
                year: Number(form.year),
                description: form.description,
            });

            setForm({
                code: "",
                name: "",
                customer: "",
                year: new Date().getFullYear().toString(),
                description: "",
            });

            toast.success("Project created successfully.");

            router.refresh();

        } catch (error) {

            console.error(error);
            if (error instanceof Error) {
                console.log(error.message);
            }

            if (
                error instanceof Error &&
                error.message === "PROJECT_CODE_EXISTS"
            ) {

                toast.error("Project code already exists.");

            } else if (
                error instanceof Error &&
                error.message === "PROJECT_NAME_EXISTS"
            ) {

                toast.error("Project name already exists.");

            } else {

                toast.error("Failed to create project.");

            }

        } finally {

            setIsCreating(false);

        }
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
                    Create New Project
                </div>

                <div
                    style={{
                        marginTop: 6,
                        fontSize: 14,
                        color: "#64748B",
                        lineHeight: 1.6,
                    }}
                >
                    Create a new survey project. Project information can be edited later if needed.
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
                        onClick={handleReset}
                    >
                        Reset
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleCreateProject}
                        disabled={isCreating}
                    >
                        {isCreating ? "Creating..." : "Create Project"}
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
};