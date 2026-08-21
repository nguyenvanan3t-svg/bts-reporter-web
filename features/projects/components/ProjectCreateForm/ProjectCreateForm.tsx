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

            handleReset();

            toast.success(
                "Project created successfully.",
            );

            router.refresh();
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                console.log(error.message);
            }

            if (
                error instanceof Error &&
                error.message ===
                    "PROJECT_CODE_EXISTS"
            ) {
                toast.error(
                    "Project code already exists.",
                );
            } else if (
                error instanceof Error &&
                error.message ===
                    "PROJECT_NAME_EXISTS"
            ) {
                toast.error(
                    "Project name already exists.",
                );
            } else {
                toast.error(
                    "Failed to create project.",
                );
            }
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <section
            style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: 16,
                padding: 16,
                boxShadow:
                    "0 8px 24px rgba(15,23,42,.06)",
            }}
        >
            <div
                style={{
                    marginBottom: 10,
                }}
            >
                <div
                    style={{
                        fontSize: 21,
                        fontWeight: 750,
                        lineHeight: 1.15,
                        color: "#102A56",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Create New Project
                </div>

                <div
                    style={{
                        marginTop: 5,
                        fontSize: 12,
                        lineHeight: 1.4,
                        color: "#64748B",
                    }}
                >
                    Project information can be edited later if needed.
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                }}
            >
                <Field
                    label="Project Code *"
                    placeholder="Enter project code"
                    value={form.code}
                    onChange={(value) =>
                        setForm({
                            ...form,
                            code: value,
                        })
                    }
                />

                <Field
                    label="Project Name *"
                    placeholder="Enter project name"
                    value={form.name}
                    onChange={(value) =>
                        setForm({
                            ...form,
                            name: value,
                        })
                    }
                />

                <Field
                    label="Customer"
                    placeholder="Enter customer"
                    value={form.customer}
                    onChange={(value) =>
                        setForm({
                            ...form,
                            customer: value,
                        })
                    }
                />

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "0.8fr 1.2fr",
                        gap: 10,
                    }}
                >
                    <Field
                        label="Year"
                        type="number"
                        placeholder="2026"
                        value={form.year}
                        onChange={(value) =>
                            setForm({
                                ...form,
                                year: value,
                            })
                        }
                    />

                    <div>
                        <div style={labelStyle}>
                            Description
                        </div>

                        <textarea
                            placeholder="Description"
                            rows={1}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description:
                                        e.target.value,
                                })
                            }
                            style={{
                                ...inputStyle,
                                height: 44,
                                padding: "0 13px",
                                resize: "none",
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        height: 1,
                        background: "#E2E8F0",
                        margin: "3px 0 1px",
                    }}
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "flex-end",
                        gap: 8,
                        marginTop: 0,
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
                        onClick={
                            handleCreateProject
                        }
                        disabled={isCreating}
                    >
                        {isCreating
                            ? "Creating..."
                            : "Create Project"}
                    </Button>
                </div>
            </div>
        </section>
    );
}

function Field({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <div>
            <div style={labelStyle}>{label}</div>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                style={inputStyle}
            />
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 650,
    color: "#334155",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 40,
    padding: "0 12px",
    borderRadius: 8,
    border: "1px solid #CBD5E1",
    fontSize: 13,
    color: "#111827",
    background: "#FFFFFF",
    boxSizing: "border-box",
    outline: "none",
};
