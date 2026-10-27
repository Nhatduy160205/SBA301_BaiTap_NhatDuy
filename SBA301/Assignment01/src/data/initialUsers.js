export const INITIAL_USERS = [
  {
    id: 1,
    username: "Admin",
    password: "Admin", // Mock password per requirement R03
    fullName: "System Administrator",
    email: "admin@funews.fpt.edu.vn",
    role: 1, // 1: Admin, 2: Staff
    status: 1,
    createdAt: "2026-08-01T00:00:00Z"
  },
  {
    id: 2,
    username: "staff",
    password: "staff123",
    fullName: "Nguyễn Văn Biên Tập",
    email: "bientap.staff@funews.fpt.edu.vn",
    role: 2, // 2: Staff
    status: 1,
    createdAt: "2026-08-15T09:00:00Z"
  },
  {
    id: 3,
    username: "reporter_hoa",
    password: "password123",
    fullName: "Trần Thị Cúc Hoa",
    email: "hoa.ttc@funews.fpt.edu.vn",
    role: 2,
    status: 1,
    createdAt: "2026-09-01T10:30:00Z"
  },
  {
    id: 4,
    username: "guest_editor",
    password: "password123",
    fullName: "Lê Hoàng Long",
    email: "long.lh@funews.fpt.edu.vn",
    role: 2,
    status: 0, // Inactive user
    createdAt: "2026-09-10T15:20:00Z"
  }
];
