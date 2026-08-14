CREATE TABLE station_resources
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    station_id UUID NOT NULL
        REFERENCES stations(id)
        ON DELETE CASCADE,

    resource_type TEXT NOT NULL,

    status TEXT NOT NULL,

    type TEXT,

    file_name TEXT,

    path TEXT,

    size BIGINT,

    modified_at TIMESTAMPTZ,

    scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(station_id, resource_type),

    CONSTRAINT chk_station_resource_type
        CHECK (
            resource_type IN (
                'survey',
                'word',
                'visio',
                'pdf'
            )
        ),

    CONSTRAINT chk_station_resource_status
        CHECK (
            status IN (
                'FOUND',
                'MISSING'
            )
        ),

    CONSTRAINT chk_station_resource_kind
        CHECK (
            type IS NULL
            OR type IN (
                'file',
                'folder'
            )
        )
);