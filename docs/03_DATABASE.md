# Web QLDA

# DATABASE DESIGN PRINCIPLES

Version: 1.0

Status: LOCKED

---

# 1. Mục tiêu

Database của Web QLDA được thiết kế để phục vụ quản lý.

Database không thay thế FTP.

Database không thay thế hồ sơ kỹ thuật.

Database không lưu toàn bộ dữ liệu của Project.

---

# 2. Vai trò của Database

Database chịu trách nhiệm:

- Quản lý Project
- Quản lý Station Metadata
- Quản lý Metadata của hồ sơ
- Quản lý trạng thái
- Quản lý người dùng
- Quản lý phân quyền
- Phục vụ tìm kiếm
- Phục vụ Dashboard
- Phục vụ báo cáo

---

# 3. Nguồn dữ liệu

Database không tự sinh dữ liệu.

Dữ liệu được đồng bộ từ các nguồn khác.

Ví dụ

Project
← Người dùng

Station
← Danh sách Station

Survey
← FTP

Word
← FTP

Visio
← FTP

PDF
← FTP

Dashboard
← Database tính toán

---

# 4. Metadata

Database chỉ lưu Metadata.

Ví dụ

Project

- Name
- Customer
- Status

Station

- Code
- Name
- Project
- Address
- FTP Path

Document

- File Name
- File Type
- File Size
- Last Modified
- FTP Path

---

# 5. Không lưu dữ liệu kỹ thuật

Database không lưu:

GPS

Latitude

Longitude

Azimuth

Antenna

Radio

Equipment

Power

Tilt

Transmission

Cable

Các thông số đã tồn tại trong hồ sơ.

---

# 6. Không lưu dữ liệu trùng lặp

Nếu một thông tin đã tồn tại trong:

- Survey
- Word
- Visio
- PDF
- JSON

thì Database không lưu lại lần thứ hai nếu không phục vụ quản lý.

---

# 7. FTP Path

Mọi dữ liệu trên FTP phải có khả năng truy xuất.

Database lưu FTP Path để:

- Mở file
- Download
- Scan
- Đồng bộ

FTP Path là cầu nối giữa Metadata và dữ liệu thật.

---

# 8. Trạng thái

Các trạng thái nên được tính toán.

Ví dụ

Survey Exists

Word Exists

Visio Exists

PDF Exists

Completed

Missing

Không khuyến khích nhập thủ công.

---

# 9. Quan hệ dữ liệu

Quan hệ quản lý

Project

↓

Station

↓

Document Metadata

Quan hệ dữ liệu thật

Project

↓

FTP Folder

↓

Survey Package

↓

Documents

Hai quan hệ này phải luôn đồng bộ.

---

# 10. Nguyên tắc thiết kế

Trước khi thêm một cột mới vào Database phải trả lời được:

1. Cột này phục vụ việc gì?

2. Có phải Metadata không?

3. Có tồn tại sẵn trong hồ sơ không?

4. Có thật sự cần để tìm kiếm, quản lý hoặc báo cáo không?

Nếu không trả lời được thì không thêm cột.

---

# 11. Quy tắc mở rộng

Khi phát triển module mới:

- Ưu tiên sử dụng dữ liệu hiện có.
- Không thêm cột chỉ để thuận tiện khi lập trình.
- Không thêm bảng khi có thể mở rộng bảng hiện có.
- Mọi thay đổi Database phải có Decision mới.

Database chỉ thay đổi khi nghiệp vụ thay đổi, không thay đổi vì UI hoặc code.

---

# 12. Migration

Toàn bộ thay đổi Database phải được quản lý bằng Migration.

Quy tắc đặt tên:

001_create_projects.sql

002_create_stations.sql

003_xxx.sql

Migration chỉ được đánh số tăng dần, không sửa hoặc ghi đè Migration đã phát hành.

Seed Data được lưu riêng trong:

database/seeds/

Ví dụ:

001_projects.sql