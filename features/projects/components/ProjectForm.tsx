"use client";

import { useState } from "react";


export function ProjectForm() {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!code.trim()) {
      alert("Project code is required");
      return;
    }

    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    if (!customer.trim()) {
      alert("Customer is required");
      return;
    }

    if (year < 2000 || year > 2100) {
      alert("Invalid year");
      return;
    }

    const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        code: code.trim(),
        name: name.trim(),
        customer: customer.trim(),
        year,
        description: description.trim(),
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        return;
    }

    alert("Project created");

    window.location.reload();
    }

  return (
    <form onSubmit={handleSubmit}
      style={{
        marginBottom: 30,
        padding: 20,
        border: "1px solid #ddd",
        maxWidth: 700,
      }}
    >
      <h2>Create Project</h2>

      <div style={{ marginBottom: 16 }}>
        <label>Code</label>

        <input
            style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                boxSizing: "border-box",

                backgroundColor: "#ffffff",
                color: "#171717",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                outline: "none",
            }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Name</label>

        <input
            style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                boxSizing: "border-box",

                backgroundColor: "#ffffff",
                color: "#171717",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                outline: "none",
            }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Customer</label>

        <input
            style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                boxSizing: "border-box",

                backgroundColor: "#ffffff",
                color: "#171717",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                outline: "none",
            }}
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>Year</label>

        <input
            type="number"
            style={{
            width: "100%",
            padding: 8,
            marginTop: 6,
            boxSizing: "border-box",
            backgroundColor: "#ffffff",
            color: "#171717",
            border: "1px solid #d1d5db",
            borderRadius: 4,
            display: "block",
            maxWidth: 150,
            }}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Description</label>

        <textarea
            rows={4}
            style={{
                width: "100%",
                padding: 8,
                marginTop: 6,
                boxSizing: "border-box",

                backgroundColor: "#ffffff",
                color: "#171717",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                outline: "none",
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
      </div>

      <button
        type="submit"
        style={{
            padding: "10px 20px",
            cursor: "pointer",
        }}
        >
        Create Project
        </button>
    </form>
  );
}