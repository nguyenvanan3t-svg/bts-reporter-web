create table if not exists public.ftp_scan_runs (
    id uuid primary key default gen_random_uuid(),

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    started_at timestamptz not null default now(),

    completed_at timestamptz,

    status text not null default 'RUNNING'
        check (
            status in (
                'RUNNING',
                'COMPLETED',
                'FAILED'
            )
        ),

    error_message text,

    created_at timestamptz not null default now()
);

create index if not exists idx_ftp_scan_runs_project_id
    on public.ftp_scan_runs(project_id);

create index if not exists idx_ftp_scan_runs_project_started_at
    on public.ftp_scan_runs(
        project_id,
        started_at desc
    );