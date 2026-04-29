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

  const soldeResponse = await axios.get("http://127.0.0.1:8000/api/my-solde", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const solde = soldeResponse.data.solde;

  const user = {
  ...response.data.user,

  name:
    response.data.user.name ||
    `${response.data.user.nom || ""} ${response.data.user.prenom || ""}`.trim(),

  soldeConge: solde,

  balances: [
    {
      year: new Date().getFullYear() - 1,
      earnedDays: Number(response.data.user.solde_annee_derniere || 0),
      usedDays: 0,
    },
    {
      year: new Date().getFullYear(),
      earnedDays:
        Number(response.data.user.solde_annee_precedente || 0) +
        Number(solde?.total_annuel || 0),

      usedDays: Number(solde?.solde_utilise || 0),
    },
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