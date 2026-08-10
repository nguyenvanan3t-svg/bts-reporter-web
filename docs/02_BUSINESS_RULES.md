# Web QLDA

# BUSINESS RULES

Version: 1.0

Status: ACTIVE

---

# BR-000

## Triết lý hệ thống

Website không sinh ra dữ liệu.

Website chỉ quản lý dữ liệu.

Website nhận diện dữ liệu từ các nguồn đầu vào.

Website quản lý trạng thái của dữ liệu.

---

# BR-001

## Quy chuẩn Survey Package

Một Station tương ứng đúng một Survey Package.

Survey Package có thể là:

Loại 1

DBN0225/

Loại 2

1 - DBN0225/

Quy tắc

<STT> - <StationCode>

STT chỉ phục vụ sắp xếp.

Website bỏ qua STT.

Loại 3

DBN0225.zip

hoặc

NguyenVanA_DBN0225.zip

Sau khi giải nén phải thu được

DBN0225/

hoặc

1 - DBN0225/

---

# BR-002

## Nhận diện StationCode

Nếu Folder

DBN0225

↓

StationCode

DBN0225

Nếu Folder

15 - DBN0225

↓

StationCode

DBN0225

Website chỉ nhận diện theo quy tắc này.

Không suy luận thêm.

---

# BR-003

## Nội dung Survey Package

Survey Package có thể chứa

DBN0225/

    DBN0225.json

    DBN0225_AT.jpg

    DBN0225_CT.jpg

    DBN0225_NT.jpg

    ...

JSON là Optional.

Ảnh không giới hạn số lượng.

Website không phụ thuộc vào JSON.

---

# BR-004

## FTP là nguồn dữ liệu

Survey Package luôn nằm trên FTP Server.

Website phải lấy dữ liệu từ FTP.

Không lấy dữ liệu từ Database để thay thế FTP.

---

# BR-005

## Database chỉ lưu Metadata

Database không lưu dữ liệu kỹ thuật.

Database chỉ lưu thông tin phục vụ:

- Quản lý
- Tra cứu
- Truy xuất
- Báo cáo

---

# BR-006

## Project là trung tâm quản lý

Mỗi Station thuộc một Project.

Project quản lý:

- Danh sách Station
- Tiến độ
- Hồ sơ
- FTP Folder

---

# BR-007

## Danh sách Station

Danh sách Station của Project có thể được khởi tạo từ:

- Import Excel
- File tiến độ Online
- Đồng bộ từ hệ thống nghiệp vụ

Website không hỗ trợ tạo từng Station thủ công.

Danh sách Station có thể thay đổi trong suốt vòng đời Project thông qua chức năng Import.

---

# BR-008

## Trạng thái Station

Trạng thái của Station không nhập thủ công nếu có thể xác định tự động.

Ví dụ:

Có Survey

↓

FTP

Có Word

↓

FTP

Có Visio

↓

FTP

Có PDF

↓

FTP

Tiến độ Project

↓

Đối chiếu dữ liệu

---

# BR-009

## Website không lưu dữ liệu trùng lặp

Nếu dữ liệu đã tồn tại trong:

- Survey
- JSON
- Word
- Visio
- PDF

Website không lưu lại lần thứ hai nếu không phục vụ quản lý.

---

# BR-010

## Business Rule ưu tiên cao nhất

Mọi module đều phải tuân theo Business Rules.

Nếu Code khác Business Rules.

Code phải sửa.

Business Rules không sửa theo Code.
---

# BR-011

## Danh sách Station của Project

Mỗi Project khi được tạo sẽ có một danh sách Station ban đầu.

Danh sách này là cơ sở để:

- Quản lý tiến độ
- Đối chiếu Survey Package
- Quản lý hồ sơ
- Thống kê Dashboard

Website không khuyến khích tạo từng Station thủ công.

Danh sách Station được Import từ nguồn dữ liệu của Project.

---

# BR-012

## Cập nhật danh sách Station

Trong quá trình triển khai Project, danh sách Station có thể thay đổi.

Ví dụ:

- Thêm Station
- Bỏ Station
- Đổi thông tin Station

Website phải hỗ trợ Import lại danh sách.

Danh sách được Import sau sẽ được coi là danh sách chuẩn của Project tại thời điểm Import.

Website phải đồng bộ Metadata theo danh sách mới.

Không yêu cầu người dùng cập nhật từng Station thủ công.