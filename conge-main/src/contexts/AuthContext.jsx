import React, { createContext, useContext, useState } from 'react';

// Mock users for demo
import { BalanceProvider, useBalance } from './BalanceContext';

const MOCK_USERS = {
  'employe@ofppt.ma': {
    id: '1',
    name: 'Ahmed Bennani',
    email: 'employe@ofppt.ma',
    role: 'employee',
    department: 'Formation',
    hireDate: '2020-01-01',
    balances: [
      { year: 2024, earnedDays: 22, usedDays: 4 },
      { year: 2025, earnedDays: 22, usedDays: 0},
      { year: 2026, earnedDays: 22, usedDays: 0 }
    ],
    password: 'demo123',
  },
  'responsable@ofppt.ma': {
    id: '2',
    name: 'Fatima Alaoui',
    email: 'responsable@ofppt.ma',
    role: 'manager',
    department: 'Formation',
    hireDate: '2018-01-01',
    balances: [
      { year: 2024, earnedDays: 22, usedDays: 0 },
      { year: 2025, earnedDays: 22, usedDays: 0 },
      { year: 2026, earnedDays: 0, usedDays: 0 }
    ],
    password: 'demo123',
  },
  'directeur@ofppt.ma': {
    id: '3',
    name: 'Mohammed Tazi',
    email: 'directeur@ofppt.ma',
    role: 'director',
    department: 'Direction',
    hireDate: '2015-01-01',
    balances: [
      { year: 2024, earnedDays: 22, usedDays: 0 },
      { year: 2025, earnedDays: 22, usedDays: 0 },
      { year: 2026, earnedDays: 22, usedDays: 0}
    ],
    password: 'demo123',
  },
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('conge_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('conge_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('conge_user');
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
