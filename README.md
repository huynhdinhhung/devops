# 🏋️ GYM Manage System - Hệ Thống Quản Lý Phòng Tập Gym (Node.js & MongoDB)

Chào mừng bạn đến với **GYM Manage System**, một giải pháp toàn diện để quản lý phòng tập gym hiện đại, được xây dựng trên nền tảng **Node.js (Express)** và **MongoDB**. Hệ thống cung cấp các cổng thông tin riêng biệt cho Admin, Hội viên và Huấn luyện viên.

---

## 🌟 Tính Năng Chính

### 🛡️ Hệ Thống Dashboards Đa Vai Trò
- **Admin Portal**: Quản lý toàn diện Hội viên, HLV, Gói tập, Thiết bị, Điểm danh và Bài viết.
- **Member Portal (Hội viên)**: Theo dõi gói tập hiện tại, lịch tập sắp tới, lịch sử thanh toán và thông tin cá nhân.
- **Trainer Portal (HLV)**: Theo dõi lịch dạy chi tiết, thông tin học viên và thống kê buổi dạy.

### 👥 Quản Lý Chức Năng
- **Điểm danh (Attendance)**: Hệ thống check-in/out dành cho hội viên.
- **Thanh toán Momo**: Tích hợp thanh toán trực tuyến qua cổng Momo (Sandbox).
- **Xuất Báo Cáo**: Hỗ trợ xuất báo cáo doanh thu định dạng PDF.
- **Tin tức & Blog**: Hệ thống quản lý bài viết về sức khỏe và dinh dưỡng.

### 🔒 Bảo Mật
- **Phân quyền (RBAC)**: Middleware kiểm soát truy cập dựa trên vai trò (Admin, Staff, Trainer, User).
- **Anti-Inspection**: Chặn phím F12, Ctrl+U và chuột phải để bảo vệ mã nguồn phía client.

---

## 🚀 Công Nghệ Sử Dụng

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **View Engine**: EJS (Server-side Rendering)
- **Authentication**: Passport.js (Local Strategy)
- **Styling**: Bootstrap 5, Font Awesome 6, Plus Jakarta Sans Font
- **PDF**: PDFKit (Báo cáo doanh thu)

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy

### 1. Yêu Cầu Hệ Thống
- **Node.js**: Phiên bản 16.x trở lên
- **MongoDB**: Đã cài đặt cục bộ hoặc sử dụng MongoDB Atlas

### 2. Cài Đặt Dependencies
Mở terminal tại thư mục gốc của dự án và chạy:
```bash
npm install
```

### 3. Cấu Hình Môi Trường (.env)
Tạo hoặc chỉnh sửa file `.env` tại thư mục gốc với các thông số:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/GymManage
SESSION_SECRET=your_secret_key_here

# MOMO CONFIG (Tùy chọn)
MOMO_PARTNER_CODE=...
MOMO_ACCESS_KEY=...
MOMO_SECRET_KEY=...
```

### 4. Khởi Chạy Ứng Dụng

**Chế độ phát triển (Tự động tải lại khi đổi code):**
```bash
npm run dev
```

**Chế độ Production:**
```bash
npm start
```

Sau khi chạy, truy cập ứng dụng tại: `http://localhost:3000`

---

## 📂 Tài Khoản Mặc Định (Nếu có dữ liệu mẫu)
- **Admin**: `admin` / `password123` (Hoặc tài khoản bạn đã tạo trong MongoDB)

---

## 🤝 Đóng Góp
Mọi góp ý hoặc phản hồi vui lòng liên hệ đội ngũ phát triển.

---
*Phát triển bởi Đội ngũ GYM Manage System (Node.js Version)*
