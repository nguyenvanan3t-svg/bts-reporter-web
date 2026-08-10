# Web QLDA

# SOFTWARE ARCHITECTURE

Version: 1.0

Status: LOCKED

---

# 1. Mục tiêu

Kiến trúc của Web QLDA được thiết kế theo hướng:

- Dễ mở rộng
- Dễ bảo trì
- Tách biệt nghiệp vụ và giao diện
- Hạn chế phụ thuộc giữa các module
- Hỗ trợ phát triển lâu dài

---

# 2. Nguyên tắc

Business Rule

↓

Service

↓

Repository

↓

Database

UI chỉ hiển thị.

Business Logic không nằm trong UI.

---

# 3. Thư mục dự án

app/

features/

components/

services/

database/

constants/

hooks/

docs/

Mỗi thư mục có một trách nhiệm rõ ràng.

---

# 4. App Router

app/

Chịu trách nhiệm:

- Routing
- Layout
- Server Components
- API Routes

Không chứa Business Logic.

---

# 5. Features

Mỗi nghiệp vụ là một Feature độc lập.

Ví dụ

features/

    projects/

    stations/

    documents/

    scanner/

    dashboard/

    settings/

Các Feature không truy cập trực tiếp vào nhau.

Nếu cần dùng chung phải thông qua Service hoặc Shared Components.

---

# 6. Cấu trúc Feature

Ví dụ

projects/

    components/

    repository.ts

    service.ts

    mapper.ts

    schema.ts

    constants.ts

    types.ts

    index.ts

Quy tắc:

components

↓

service

↓

repository

Repository không gọi ngược Service.

---

# 7. Repository

Repository chịu trách nhiệm:

- Đọc Database
- Ghi Database

Không chứa Business Logic.

---

# 8. Service

Service là nơi chứa Business Logic.

Service có thể:

- Gọi Repository
- Gọi FTP
- Gọi API khác
- Xử lý dữ liệu
- Tính toán trạng thái

Service không phụ thuộc UI.

---

# 9. Mapper

Mapper chuyển đổi dữ liệu giữa:

Database

↓

Domain

↓

UI

Mapper không xử lý nghiệp vụ.

---

# 10. Schema

Schema chịu trách nhiệm:

- Validation
- Parse dữ liệu
- Kiểm tra định dạng

Không xử lý Business Logic.

---

# 11. Components

Components trong Feature chỉ phục vụ Feature đó.

Ví dụ

projects/components/

Không được import trực tiếp sang Feature khác.

Nếu muốn dùng chung phải chuyển sang:

components/

---

# 12. Shared Components

components/

Là nơi chứa:

Button

Form

Dialog

Table

Input

...

Các Component này không chứa nghiệp vụ.

---

# 13. Services

services/

Là nơi chứa các dịch vụ dùng chung.

Ví dụ

Dependency Injection

FTP Client

Logger

Configuration

Singleton

...

---

# 14. Constants

constants/

Chứa:

Enum

Config

Constant

Không chứa Logic.

---

# 15. Hooks

hooks/

Chứa:

Custom Hooks

React Hooks dùng chung

Không chứa Business Logic.

---

# 16. Database Layer

Database chỉ được truy cập thông qua Repository.

UI không truy cập Database.

Service không truy cập Database trực tiếp.

---

# 17. Dependency Rule

Chiều phụ thuộc chỉ được phép:

UI

↓

Service

↓

Repository

↓

Database

Không được phụ thuộc ngược.

---

# 18. Module Independence

Mỗi Feature phải có thể phát triển độc lập.

Không được sửa Feature khác nếu không cần thiết.

---

# 19. Coding Rules

Một file chỉ nên có một trách nhiệm.

Một hàm chỉ nên thực hiện một nhiệm vụ.

Không viết Business Logic trong Component.

Không viết SQL trong UI.

Không viết Validation trong Repository.

---

# 20. Nguyên tắc mở rộng

Khi thêm Module mới:

1. Tạo Feature mới.

2. Không sửa Feature cũ nếu không cần.

3. Tuân thủ Architecture hiện tại.

4. Nếu Architecture cần thay đổi phải tạo Decision mới trước khi thực hiện.