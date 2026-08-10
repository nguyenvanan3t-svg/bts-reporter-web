# Web QLDA

# DECISIONS

Version: 1.0

Status: LOCKED

---

# Decision-001

Title

Web QLDA chỉ là hệ thống quản lý.

Status

LOCKED

Description

Web QLDA dùng để:

- Quản lý Project
- Quản lý Station Metadata
- Quản lý tiến độ
- Quản lý hồ sơ
- Truy xuất hồ sơ

Không phát triển theo hướng Asset Management.

---

# Decision-002

Title

FTP là nguồn dữ liệu chính.

Status

LOCKED

Description

FTP Server chứa dữ liệu thật.

Database không phải nguồn dữ liệu chính.

Website chỉ quản lý Metadata.

---

# Decision-003

Title

Database chỉ lưu Metadata.

Status

LOCKED

Description

Database chỉ lưu những thông tin phục vụ:

- Quản lý
- Tìm kiếm
- Truy xuất
- Báo cáo

Không lưu lại các dữ liệu đã tồn tại trong hồ sơ.

---

# Decision-004

Title

Station được nhận diện từ Survey Package.

Status

LOCKED

Description

Station không được tạo theo tư duy CRUD thông thường.

Station được nhận diện từ Survey Package theo Business Rules.

---

# Decision-005

Title

Business Rule ưu tiên hơn Code.

Status

LOCKED

Description

Nếu Code khác Business Rule.

Business Rule luôn đúng.

Code phải sửa theo Business Rule.

---

# Decision-006

Title

Workflow ưu tiên hơn UI.

Status

LOCKED

Description

Mọi module phải được thiết kế theo Workflow nghiệp vụ.

Không thiết kế Database hoặc UI trước Workflow.

---

# Decision-007

Title

Không duplicate dữ liệu.

Status

LOCKED

Description

Nếu dữ liệu đã tồn tại:

- Survey
- Word
- Visio
- PDF
- JSON

thì Database không lưu lại nếu không cần.

---

# Decision-008

Title

Architecture đã khóa.

Status

LOCKED

Description

Kiến trúc chuẩn:

Repository

↓

Service

↓

API

↓

UI

Không thay đổi khi chưa có Decision mới.

---

# Decision-009

Title

Shared Components dùng chung.

Status

LOCKED

Description

Các Component dùng chung:

- Button
- Form
- ConfirmDialog

Sau khi ổn định sẽ không redesign.

Chỉ sửa khi có Bug hoặc Business Rule mới.

---

# Decision-010

Title

Mọi module mới phải đọc Docs trước khi code.

Status

LOCKED

Description

Trước khi bắt đầu bất kỳ module nào phải đọc:

- 00_PROJECT.md
- 02_BUSINESS_RULES.md
- 04_WORKFLOW.md
- 06_DECISIONS.md

Nếu đề xuất trái với các tài liệu trên thì đề xuất đó không hợp lệ.
---

# DEC-011

Title

Station không được tạo thủ công từng bản ghi.

Status

LOCKED

Description

Station của Project được quản lý theo danh sách.

Danh sách được Import từ nguồn dữ liệu của Project.

Không thiết kế chức năng Add Station từng dòng như CRUD thông thường.

---

# DEC-012

Title

Import là nguồn cập nhật danh sách Station.

Status

LOCKED

Description

Trong suốt vòng đời của Project, danh sách Station có thể thay đổi.

Website phải hỗ trợ Import lại danh sách.

Danh sách mới sẽ thay thế danh sách cũ và trở thành danh sách chuẩn của Project.

---

# DEC-013

Import Station List là đầu vào chính của Project.

LOCKED

Description

Mỗi Project phải có Station List.

Station List được Import.

Không tạo Station thủ công.

FTP Scanner chỉ hoạt động sau khi Station List tồn tại.

---

# DEC-014

Title

Module phát triển theo Workflow.

Status

LOCKED

Description

Các module mới của Web QLDA được xây dựng theo Workflow nghiệp vụ.

Không thiết kế theo CRUD trước.

Mỗi Workflow phải xác định rõ:

- Đầu vào
- Xử lý
- Đầu ra

Sau đó mới thiết kế Architecture và Code.

---

# DEC-015

Title

Station Code là Business Key của toàn hệ thống.

Status

LOCKED

Description

Station Code được lấy nguyên trạng từ danh sách Project.
Website không thay đổi định dạng Station Code.
Station Code là khóa liên kết giữa:
Project Station List
Survey Package
Word
Visio
PDF
Dashboard
Search
Scanner
Mọi thao tác nhận diện đều dựa trên Station Code.

---

# DEC-016

Title: Station là thực thể trung tâm của hệ thống.

Description:

Project là đơn vị quản lý.
Station là đối tượng nghiệp vụ trung tâm.
Mọi dữ liệu từ Planning (Excel) và Production (FTP, Survey, Word, Visio, PDF) đều được liên kết thông qua Station Code.
Dashboard, Search, Scanner và Document Management đều xoay quanh Station.

---

# DEC-017

Title

Station List chỉ đồng bộ theo Station Code.

Status

LOCKED

Description

Khi Import Station List:

Chỉ sử dụng Station Code để đối chiếu.
Không coi thay đổi Province hoặc Address là thay đổi nghiệp vụ.
Không so sánh STT.
Không so sánh thứ tự dòng trong Excel.
Không so sánh cột Ghi chú.
Không so sánh Date.

Mục tiêu của Station List là xác định Project hiện có những Station nào, không phải đồng bộ toàn bộ thông tin của trạm.

---

# DEC-018

Title

Station Module Architecture.

Status

LOCKED

Description

Module Station phải tuân theo kiến trúc:

Excel Import

↓

Station Service

↓

Station Repository

↓

API

↓

Database

Excel Import chỉ chịu trách nhiệm:

- Đọc dữ liệu
- Parse
- Validate
- Compare

Không truy cập Database.

Station Service chịu trách nhiệm nghiệp vụ.

Station Repository chỉ thao tác Database.

UI không gọi Repository trực tiếp.

---

# DEC-019

Title

Database Migration Management.

Status

LOCKED

Description

Database Schema được quản lý bằng Migration.

Mọi thay đổi Database phải tạo Migration mới.

Không sửa trực tiếp Migration đã phát hành.

Cấu trúc chuẩn:

database/

    migrations/

    seeds/

Migration chỉ tạo hoặc thay đổi Schema.

Seed chỉ sinh dữ liệu mẫu.

Không trộn Migration và Seed.

---

# DEC-020

Title

Station data is persisted immediately after Import.

Decision

Import no longer stores stations only in React state.

After user confirms import:

Excel
→ Compare
→ applyImport()
→ POST /api/stations
→ Supabase

The UI state is refreshed from persisted data.

Reason

Avoid duplicated state.
Ensure browser refresh never loses imported stations.
Single source of truth is the database.

---

Decision-016

Title

Station Detail chỉ quản lý Metadata và Resource.

Status

LOCKED

Description

Station Detail không hiển thị dữ liệu kỹ thuật của Survey.

Station Detail chỉ quản lý:

- Survey Resource
- Word Resource
- Visio Resource
- PDF Resource

Mỗi Resource chỉ thể hiện:

- Found / Missing
- Open
- Download
- Upload Replace

Không duplicate dữ liệu từ hồ sơ vào Database.

---

# DEC-021
Title

Website không chỉnh sửa trực tiếp Resource.

Status

LOCKED

Description

Website chỉ quản lý Resource Metadata.

Đối với Survey, Word, Visio, PDF:

- Download
- Upload Replace

Mọi thao tác chỉnh sửa nội dung Resource được thực hiện bằng phần mềm chuyên dụng ngoài Website.

Website không phát triển chức năng:

- Open
- Edit
- Preview
- Delete Resource

----

DEC-017

Station Detail chỉ giám sát tài nguyên FTP.

Website không phân tích nội dung Word.

Website không phân tích nội dung Visio.

Website không phân tích nội dung PDF.

Website chỉ kiểm tra:

Survey

Word

Visio

PDF

Download

Upload

FTP là nguồn dữ liệu duy nhất.

---

Homepage

┌─────────────────────────────────────────────────────────────────────┐
│ Search Station Code.......................................... 🔍    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────── 8 cột ─────────────────────────┬───── 4 cột ─────┐
│                                                               │                  │
│ Current Projects                                               │ Create Project   │
│                                                               │                  │
│ ┌──────────────┐  ┌──────────────┐                            │ Code             │
│ │ Project Card │  │ Project Card │                            │ Name             │
│ └──────────────┘  └──────────────┘                            │ Customer         │
│                                                               │ Year             │
│ ┌──────────────┐  ┌──────────────┐                            │ Description      │
│ │ Project Card │  │ Project Card │                            │                  │
│ └──────────────┘  └──────────────┘                            │ [ Create ]       │
│                                                               │                  │
└───────────────────────────────────────────────────────────────┴──────────────────┘


PROJECT MODULE

Home
├── ProjectDashboard
├── ProjectLeftPanel
├── ProjectCard
└── ProjectCreateForm

Project Detail
├── ProjectHeader
├── ProjectMetrics
├── ProjectInformation
├── StationList
└── (Bottom Toolbar - sẽ làm)

Station Detail
├── StationInformation
├── ResourceCard
└── ResourceStatusTable

# Decision-022

Title

Home Dashboard UI Architecture.

Status

LOCKED

Description

Homepage adopts the following workflow and layout:

Search Station Code

↓

Project Search Result

↓

Project Detail

↓

Station Detail

Homepage layout:

-   Header
-   ProjectSearch
-   ProjectDashboard
    -   ProjectLeftPanel
    -   ProjectCreateForm

Project Card is the primary entry to Project Detail.