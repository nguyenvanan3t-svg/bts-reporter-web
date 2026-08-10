import { Button } from "@/components/Button";

interface Props {
    onImport?: () => void;
    onView?: () => void;

    importing?: boolean;
    disabled?: boolean;
}

export default function StationActions({
    onImport,
    onView,
    importing = false,
    disabled = false,
}: Props) {
    return (
        <div
            style={{
                display: "flex",
                gap: 12,
                marginBottom: 24,
            }}
        >
            <Button
                onClick={onImport}
                loading={importing}
                disabled={disabled}
            >
                Import Station List
            </Button>

            <Button
                variant="secondary"
                onClick={onView}
                disabled={disabled}
            >
                View Station List
            </Button>
        </div>
    );
}