CREATE TABLE projects
(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(30) NOT NULL UNIQUE,

    name VARCHAR(255) NOT NULL,

    customer VARCHAR(255),

    year INTEGER NOT NULL,

    description TEXT,

    status VARCHAR(20) NOT NULL DEFAULT 'PLANNING',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_project_status
        CHECK (status IN ('PLANNING','ACTIVE','ARCHIVED'))
);