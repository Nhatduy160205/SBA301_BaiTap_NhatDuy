import React, { createContext, useContext, useState } from "react";
import { userService } from "../services/userService";
import { storageService } from "../services/storageService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => storageService.getAuth());

  const login = (username, password) => {
    const result = userService.authenticate(username, password);
    if (result.success) {
      setCurrentUser(result.user);
      storageService.saveAuth(result.user);
      return { success: true };
    }
    return { success: false, message: result.message };
  };

  const logout = () => {
    setCurrentUser(null);
    storageService.saveAuth(null);
  };

  const updateUserProfile = (updatedData) => {
    if (!currentUser) return;
    const newSession = { ...currentUser, ...updatedData };
    setCurrentUser(newSession);
    storageService.saveAuth(newSession);
  };

  const value = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isAdmin: currentUser?.role === 1,
    isStaff: currentUser?.role === 2,
    login,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
