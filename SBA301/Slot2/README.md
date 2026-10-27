# SBA301 - Slot 02: Student Learning Dashboard

Dự án thực hành củng cố Slot 02 - ReactJS Fundamentals, Vite, Functional Components, JSX Expressions, Import/Export, và Kiến trúc MVC Layer Service.

## 1. Kiến trúc dự án (MVC Layer Service)

- **Model Layer (`src/data/dashboardData.js`)**: Định nghĩa đối tượng course, student, learning items, environment tools, group project.
- **Service Layer (`src/services/dashboardService.js`)**: Chứa toàn bộ nghiệp vụ và logic:
  - `getCourseInfo()`: Xử lý và định dạng thông tin môn học.
  - `getStudentProfile()`: Định dạng hồ sơ sinh viên, role, permissions.
  - `getLearningChecklist()`: Xử lý danh sách checklist học tập, tính toán tỷ lệ hoàn thành.
  - `getEnvironmentStatus()`: Kiểm tra trạng thái readiness của các công cụ môi trường.
  - `getGroupProjectSummary()`: Tính toán số lượng tính năng, kiểm tra phạm vi dự án.
  - `getArchitectureFlow()`: Cung cấp pipeline kiến trúc render.
- **View / Component Layer (`src/components/`)**:
  - `CourseHeader.jsx`: Tiêu đề khóa học
  - `StudentProfile.jsx`: Thông tin sinh viên
  - `LearningChecklist.jsx`: Checklist mục tiêu học tập
  - `EnvironmentStatus.jsx`: Trạng thái các công cụ
  - `ProjectSummary.jsx`: Tổng quan dự án nhóm
  - `ArchitectureFlow.jsx`: Sơ đồ luồng kiến trúc MVC & React
  - `Footer.jsx`: Chân trang xác thực kiến trúc
- **Controller / Entry (`src/App.jsx`, `src/main.jsx`)**: Kết nối luồng dữ liệu và mount React Virtual DOM vào `index.html`.

## 2. Hướng dẫn chạy

```bash
cd Slot2
npm install
npm run dev
```

Build production:
```bash
npm run build
npm run preview
```
