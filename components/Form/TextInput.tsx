import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput(props: Props) {
  return (
    <input
      {...props}
      style={{
        width: 500,
        padding: "8px 12px",
        border: "1px solid #d1d5db",
        borderRadius: 6,
        backgroundColor: "#fff",
        color: "#111827",
        boxSizing: "border-box",
        fontSize: 14,
        outline: "none",
        ...props.style,
      }}
    />
  );
}