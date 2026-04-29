import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
  const response = await axios.post("http://127.0.0.1:8000/api/login", {
    email: email.trim(),
    password: password.trim(),
  });

  const token = response.data.token;

  const user = {
    ...response.data.user,

    name:
      response.data.user.name ||
      `${response.data.user.nom || ""} ${response.data.user.prenom || ""}`.trim(),

    balances: response.data.user.balances || [
      { year: 2024, earnedDays: 22, usedDays: 0 },
      { year: 2025, earnedDays: 22, usedDays: 0 },
      { year: 2026, earnedDays: 8, usedDays: 0 },
    ],
  };

  setUser(user);

  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);

  return user;
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("conge_user");
  };

  

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};