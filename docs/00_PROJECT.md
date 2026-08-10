# Web QLDA

Version: 1.0
Status: LOCKED (Chỉ thay đổi khi có quyết định mới)

---

# 1. Project Vision

Web QLDA là hệ thống quản lý dự án BTS và quản lý hồ sơ kỹ thuật.

Mục tiêu của hệ thống không phải là lưu trữ toàn bộ dữ liệu kỹ thuật của trạm mà là quản lý, truy xuất và kiểm soát trạng thái hồ sơ trong suốt vòng đời của dự án.

Nguồn dữ liệu thực của hệ thống nằm trên FTP Server.

Database chỉ lưu Metadata phục vụ việc quản lý.

---

# 2. Mục tiêu của hệ thống

Hệ thống phải hỗ trợ:

- Quản lý Project
- Quản lý danh sách Station của từng Project
- Quản lý Survey Package gửi từ hiện trường
- Quản lý tiến độ thực hiện
- Quản lý trạng thái hồ sơ
- Truy xuất nhanh hồ sơ Word
- Truy xuất nhanh hồ sơ Visio
- Truy xuất nhanh hồ sơ PDF
- Truy xuất ảnh khảo sát
- Đồng bộ dữ liệu giữa FTP và Database

---

# 3. Hệ thống KHÔNG nhằm mục đích

Web QLDA KHÔNG phải:

- Asset Management
- Inventory System
- GIS System
- Network Planning System
- RF Planning System

Do đó Database sẽ không quản lý:

- GPS
- Latitude
- Longitude
- Azimuth
- Antenna
- Equipment
- Vendor
- Radio Parameters
- Các thông số kỹ thuật đã có trong hồ sơ

Những dữ liệu này chỉ tồn tại trong hồ sơ hoặc file Survey.

---

# 4. Triết lý thiết kế

Web QLDA chỉ quản lý Metadata.

Hồ sơ kỹ thuật luôn là nguồn dữ liệu chính.

Nếu một thông tin đã tồn tại trong hồ sơ thì Database không lưu lại lần thứ hai nếu không thật sự cần thiết.

Nguyên tắc:

Không duplicate dữ liệu.

---

# 5. Nguồn dữ liệu của hệ thống

Nguồn dữ liệu gồm hai loại.

## 5.1 Database

Database chỉ lưu:

- Project
- Station Metadata
- Trạng thái
- FTP Path
- Người phụ trách
- Các thông tin quản lý

## 5.2 FTP Server

FTP là nơi lưu dữ liệu thật.

Ví dụ:

- Survey Package
- Word
- Visio
- PDF
- Images
- JSON

---

# 6. Đầu vào của hệ thống

Đầu vào quan trọng nhất của Web QLDA là Survey Package.

Survey Package được gửi từ:

- Kỹ sư khảo sát
- Người làm hồ sơ
- Người upload dữ liệu

Survey Package có thể là:

- Folder
- ZIP

Website phải nhận diện đúng Survey Package theo Business Rules.

---

# 7. Đầu ra của hệ thống

Website phải giúp người dùng biết ngay:

- Trạm đã khảo sát chưa
- Trạm thuộc Project nào
- Đã có Survey chưa
- Đã có Word chưa
- Đã có Visio chưa
- Đã có PDF chưa
- Hồ sơ nằm ở đâu
- Có thể mở hồ sơ ngay

---

# 8. Nguyên tắc phát triển

Khi phát triển module mới phải luôn tự hỏi:

Thông tin này có phục vụ:

- Quản lý?
- Tìm kiếm?
- Truy xuất?

Nếu KHÔNG

=> Không thêm vào Database.

---

# 9. Quy tắc quan trọng nhất

Business Rule luôn ưu tiên hơn Code.

Workflow luôn ưu tiên hơn UI.

Không thay đổi kiến trúc nếu chưa có Decision mới.

Mọi module phải phục vụ đúng mục tiêu của Project Vision.

----

Station Detail dùng để:

giám sát trạng thái hồ sơ trên FTP
download hồ sơ
upload thay thế hồ sơ

Không dùng để đọc nội dung hồ sơ.