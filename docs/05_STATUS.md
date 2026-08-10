# Web QLDA

# PROJECT STATUS

Version: 1.0

Last Updated: 2026-08-04

---

# Overall Progress

Current Phase

Foundation

Project Status

🟡 In Development

Architecture

✅ Locked

Business Rules

✅ Active

Workflow

✅ Active

Database Principles

✅ Locked

---

# Module Status

| Module | Status | Notes |
|----------|---------|------|
| Projects | ✅ Completed | CRUD + Archive |
| Stations | 🟡 In Progress | Import Workflow completed, Database migration completed, GET API completed, POST API pending |
| Scanner | ⏳ Planned | Waiting Station Database |
| Documents | ⏳ Planned | Chưa bắt đầu |
| Dashboard | ⏳ Planned | Chưa bắt đầu |
| Users | ⏳ Planned | Chưa bắt đầu |
| Settings | ⏳ Planned | Chưa bắt đầu |

---

# Shared Components

| Component | Status |
|-----------|---------|
| Button | ✅ |
| Form | ✅ |
| ConfirmDialog | ✅ |
| Table | ⏳ |
| DataGrid | ⏳ |
| Modal | ⏳ |
| Toast | ✅ |

---

# Infrastructure

| Item | Status |
|------|---------|
| Next.js | ✅ |
| TypeScript | ✅ |
| TailwindCSS | ✅ |
| Supabase | ✅ |
| App Router | ✅ |
| Repository Pattern | ✅ |
| Service Layer | ✅ |
| API Route | ✅ |
| Database Migration | ✅ |

---

# Completed Features

- Project CRUD
- Archive Project
- Validation
- Shared Button
- Shared Form
- ConfirmDialog
- Toast Notification
- Station Excel Reader
- Station Excel Parser
- Station Excel Validator
- Station Compare
- Station Apply Import
- Station Import Preview
- Station Summary
- Station Actions
- Station List
- Station List Dialog
- Station Import Workflow
- Station Repository Skeleton
- Station Database Migration
- Station GET API
- Station Service Integration
- Station Repository Integration
- Supabase Connection Verified

---

# Current Focus

Module đang phát triển:

Station Management

Completed

- Station Import Workflow
- Import Preview
- Compare by Station Code
- Apply Import
- Station Summary
- Station List Dialog
- Database Migration
- GET /api/stations
- Repository → Supabase connection

Current Task

- POST /api/stations
- Persist Station List into Database
- Load Project from Database

Next Goal

Complete Station persistence through API.
Automatically load Station List when opening a Project.

---

# Next Milestones

Milestone 1

✔ Projects

Milestone 2

◐ Stations

Milestone 3

□ FTP Scanner

Milestone 4

□ Documents

Milestone 5

□ Dashboard

Milestone 6

□ Reports

---

# Technical Debt

- POST API has not been implemented.
- ProjectEditor still accesses Repository directly in several places.
- Station persistence is not fully migrated to API.

---

# Blockers

No active blockers.

---

# Notes

Mọi thay đổi kiến trúc phải cập nhật:

06_DECISIONS.md

Mọi Business Rule mới phải cập nhật:

02_BUSINESS_RULES.md

Mọi Workflow mới phải cập nhật:

04_WORKFLOW.md

Không merge tính năng mới nếu chưa cập nhật tài liệu liên quan.

---

## Station Persistence

Status: Completed

- Created Stations API (GET/POST).
- Repository layer completed.
- Service layer completed.
- ProjectEditor now saves imported stations through API.
- Station data is persisted into Supabase.
- Next step: load stations automatically when opening a project.

---

## Station Module

Status: COMPLETED (Phase 1)

Completed

- Database migration
- Repository
- Service
- API GET
- API POST
- Import Excel
- Preview
- Compare
- Save to Supabase
- Load from Supabase
- Station Summary
- Station List

Verified

- Import
- Reload Project
- Reload Browser
- Data persistence

### Completed

- Project Detail chuyển sang Dashboard Layout.
- Station List hiển thị trực tiếp trong Project Detail.
- CRUD chỉnh sửa Station đã loại bỏ khỏi giao diện.
- Tạo Station Detail page.
- Station Detail lấy dữ liệu Station theo Station ID.
- Repository hỗ trợ join Project để hiển thị tên Project.


Completed

Dashboard Layout
Station Detail Layout
Resource Card
FTP Resource Monitor UI

Current Task

FTP Scanner
FTP Resource Detection
Download API
Upload API

# Update 2026-08-06

Completed

-   Homepage UI refactored into components:
    -   ProjectDashboardHeader
    -   ProjectSearch
    -   ProjectSearchResultCard
    -   ProjectDashboard
    -   ProjectLeftPanel
    -   ProjectCreateForm
-   Home layout locked (8/4 columns).
-   Project Card displayed in 2-column grid.
-   Search Result changed to dropdown style.
-   Shared Button component adopted in ProjectCreateForm.
-   Create Project workflow verified:
    -   UI does not expose Status.
    -   Repository automatically inserts status = PLANNING.

Next Task

-   Load ProjectCard from Supabase.
-   Navigate ProjectCard -\> Project Detail.
-   Replace mock Search Result with API.
-   Connect Create Project form to projectService.create().