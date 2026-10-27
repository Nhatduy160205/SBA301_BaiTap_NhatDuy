import { storageService } from "./storageService";

export const userService = {
  getAll: () => {
    return storageService.getUsers();
  },

  getById: (id) => {
    const list = storageService.getUsers();
    return list.find((u) => Number(u.id) === Number(id)) || null;
  },

  authenticate: (username, password) => {
    const trimmedUser = (username || "").trim();
    const list = storageService.getUsers();

    // Check credentials (exact match required for security demonstration)
    const user = list.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, message: "Tên đăng nhập hoặc mật khẩu không chính xác!" };
    }

    if (Number(user.status) !== 1) {
      return { success: false, message: "Tài khoản của bạn đã bị vô hiệu hóa!" };
    }

    const sessionUser = {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      role: Number(user.role), // 1: Admin, 2: Staff
      roleName: Number(user.role) === 1 ? "Quản trị viên (Admin)" : "Nhân viên (Staff)"
    };

    return { success: true, user: sessionUser };
  },

  create: (userData) => {
    const list = storageService.getUsers();
    const cleanUsername = userData.username.trim();

    // Check uniqueness
    if (list.some((u) => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
      return { success: false, error: "Tên đăng nhập đã tồn tại trong hệ thống!" };
    }

    const newId = list.length > 0 ? Math.max(...list.map((u) => Number(u.id))) + 1 : 1;
    const newUser = {
      id: newId,
      username: cleanUsername,
      password: userData.password || "password123",
      fullName: (userData.fullName || cleanUsername).trim(),
      email: (userData.email || "").trim(),
      role: Number(userData.role ?? 2), // Default 2: Staff
      status: Number(userData.status ?? 1),
      createdAt: new Date().toISOString()
    };

    const updated = [newUser, ...list];
    storageService.saveUsers(updated);
    return { success: true, user: newUser };
  },

  update: (id, userData) => {
    const list = storageService.getUsers();
    const index = list.findIndex((u) => Number(u.id) === Number(id));
    if (index === -1) {
      return { success: false, error: `Người dùng có ID ${id} không tồn tại` };
    }

    const cleanUsername = userData.username.trim();
    // Check if new username conflicts with another existing user
    const usernameTaken = list.some(
      (u) => Number(u.id) !== Number(id) && u.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (usernameTaken) {
      return { success: false, error: "Tên đăng nhập này đã được sử dụng bởi người dùng khác!" };
    }

    const updatedUser = {
      ...list[index],
      username: cleanUsername,
      fullName: (userData.fullName || "").trim(),
      email: (userData.email || "").trim(),
      role: Number(userData.role ?? list[index].role),
      status: Number(userData.status ?? list[index].status),
      password: userData.password ? userData.password : list[index].password,
      updatedAt: new Date().toISOString()
    };

    const updated = list.map((item) =>
      Number(item.id) === Number(id) ? updatedUser : item
    );
    storageService.saveUsers(updated);
    return { success: true, user: updatedUser };
  },

  delete: (id, currentUserId) => {
    const numId = Number(id);

    // Protection rule 1: Cannot delete primary Admin (id: 1)
    if (numId === 1) {
      return {
        success: false,
        error: "Không thể xóa tài khoản Quản trị viên tối cao (Super Admin) của hệ thống!"
      };
    }

    // Protection rule 2: Cannot delete currently logged in account
    if (currentUserId && numId === Number(currentUserId)) {
      return {
        success: false,
        error: "Bạn không thể tự xóa tài khoản đang thực hiện phiên đăng nhập hiện tại!"
      };
    }

    const list = storageService.getUsers();
    const updated = list.filter((u) => Number(u.id) !== numId);
    storageService.saveUsers(updated);
    return { success: true };
  },

  search: (users, query = "", roleFilter = "all", statusFilter = "all") => {
    const normQuery = (query || "").trim().toLowerCase();
    return users.filter((item) => {
      const matchUser = (item.username || "").toLowerCase().includes(normQuery);
      const matchName = (item.fullName || "").toLowerCase().includes(normQuery);
      const matchEmail = (item.email || "").toLowerCase().includes(normQuery);
      const matchesQuery = !normQuery || matchUser || matchName || matchEmail;

      const matchesRole =
        roleFilter === "all" ||
        Number(item.role) === Number(roleFilter);

      const matchesStatus =
        statusFilter === "all" ||
        Number(item.status) === Number(statusFilter);

      return matchesQuery && matchesRole && matchesStatus;
    });
  }
};
