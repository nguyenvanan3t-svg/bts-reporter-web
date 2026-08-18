create table if not exists public.ftp_excel_sources (
    id uuid primary key default gen_random_uuid(),

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    path text not null,
    file_name text not null,

    size bigint not null default 0,

    modified_at timestamptz null,
    scanned_at timestamptz not null default now(),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create unique index if not exists
    ftp_excel_sources_project_path_unique
on public.ftp_excel_sources (
    project_id,
    path
);

create index if not exists
    ftp_excel_sources_project_id_idx
on public.ftp_excel_sources (
    project_id
);