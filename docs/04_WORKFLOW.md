# Web QLDA

# WORKFLOW

Version: 1.0

Status: ACTIVE

---

# WF-001

## Luồng tổng thể của hệ thống

                Project
                    │
                    │
        Danh sách Station
                    │
                    ▼
          FTP Project Folder
                    │
                    ▼
          Survey Package Scan
                    │
                    ▼
          Nhận diện StationCode
                    │
                    ▼
        Đối chiếu Database
                    │
                    ▼
        Cập nhật Metadata
                    │
                    ▼
       Kiểm tra Hồ sơ kỹ thuật
                    │
                    ▼
      Dashboard / Search / Report

Mọi module của Web QLDA đều xoay quanh Workflow này.

---

# WF-002

## Khởi tạo Project

Người dùng tạo Project.

Sau khi tạo Project phải có:

- Thông tin Project
- FTP Root Folder
- Danh sách Station

Danh sách Station có thể Import sau.

Project chưa có Station vẫn hợp lệ.

---

# WF-003

## Import danh sách Station

Nguồn dữ liệu có thể là:

- Excel
- File tiến độ Online
- CSV
- Thêm thủ công

Sau khi Import:

Database chỉ lưu Metadata.

Không sinh Survey Package.

---

# WF-004

## Nhận Survey Package

Survey Package được gửi từ hiện trường.

Có thể là:

Folder

hoặc

ZIP

Website không tạo Survey Package.

Website chỉ nhận diện Survey Package.

---

# WF-005

## Scan FTP

Website Scan FTP Folder của Project.

Đọc:

Folder

ZIP

Nhận diện StationCode theo BR-002.

Không phụ thuộc vào tên file ZIP.

---

# WF-006

## Đối chiếu Station

Website đối chiếu:

Expected Station

VS

Survey Package

Ví dụ

Project

DBN0225

DBN0226

DBN0227

FTP

DBN0225

DBN0227

Kết quả

DBN0225

Có Survey

DBN0226

Chưa Survey

DBN0227

Có Survey

---

# WF-007

## Kiểm tra hồ sơ

Website kiểm tra các loại hồ sơ.

Ví dụ

Survey

Word

Visio

PDF

Images

JSON

Kết quả dùng để tính trạng thái.

Không nhập thủ công.

---

# WF-008

## Dashboard

Dashboard được sinh từ Metadata.

Không nhập số liệu.

Ví dụ

100 Station

80 Survey

65 Hồ sơ hoàn chỉnh

20 Chưa Survey

15 Thiếu hồ sơ

Dashboard luôn phản ánh dữ liệu thực.

---

# WF-009

## Truy xuất hồ sơ

Người dùng chọn Station.

Website biết:

Project

↓

FTP Path

↓

Liệt kê hồ sơ

↓

Download
Upload (Replace)

Không hỗ trợ Open trực tiếp.
Muốn xem tài liệu phải Download trước.

---

# WF-010

## Đồng bộ

Khi FTP thay đổi.

Website phải đồng bộ Metadata.

Không yêu cầu nhập lại dữ liệu.

Ưu tiên dữ liệu thực trên FTP.

---

# WF-011

## Import Station List

Nguồn

Excel

↓

Read Excel

↓

Parse

↓

Validate

↓

Compare

↓

Preview

↓

Confirm Import

↓

Cập nhật Station List của Project

↓

Cập nhật Metadata

Mục tiêu:

- Chuẩn hóa danh sách Station của Project.
- Chỉ đối chiếu theo Station Code.
- Không tạo Survey Package.
- Không cập nhật trạng thái hồ sơ.