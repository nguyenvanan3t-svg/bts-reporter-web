import { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export default function FormField({
  label,
  children,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 120,
          paddingRight: 16,
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          flex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}