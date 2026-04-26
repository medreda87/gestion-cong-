import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateMonthlyLeaveBalance, removeExpiredLeaves, getTotalAvailableBalance } from '@/lib/leaveBalance';

const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [employeesBalances, setEmployeesBalances] = useState(() => {
    const stored = localStorage.getItem('conge_balances');
    return stored ? JSON.parse(stored) : {};
  });

  const saveBalances = (newBalances) => {
    setEmployeesBalances(newBalances);
    localStorage.setItem('conge_balances', JSON.stringify(newBalances));
  };

  const getEmployeeBalances = (employeeId) => {
    return employeesBalances[employeeId] || [];
  };

  const getEmployeeYearBalance = (employeeId, year, currentDate = new Date()) => {
    const balances = getEmployeeBalances(employeeId);
    const balance = balances.find(b => b.year === year);
    if (!balance) return 0;
    
    const earned = balance.earnedDays || calculateMonthlyLeaveBalance(currentDate, balance.hireDate);
    return Math.floor(earned - balance.usedDays);
  };

  const getEmployeeTotalBalance = (employeeId, currentDate = new Date()) => {
    const balances = getEmployeeBalances(employeeId);
    return getTotalAvailableBalance(balances, currentDate);
  };

  const updateEmployeeBalances = (employeeId, newBalances) => {
    const updated = {
      ...employeesBalances,
      [employeeId]: newBalances
    };
    saveBalances(updated);
  };

  // Initialize balances for new employees
  const initializeEmployeeBalances = (employeeId, hireDate = null) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    let balances = getEmployeeBalances(employeeId);
    
    // Ensure current year balance exists
    if (!balances.find(b => b.year === currentYear)) {
      balances.push({
        year: currentYear,
        earnedDays: 0, // Will be calculated on demand
        usedDays: 0,
        hireDate
      });
    }
    
    // Remove expired
    balances = removeExpiredLeaves(balances, currentYear);
    
    updateEmployeeBalances(employeeId, balances);
  };

  const deductLeaveDays = (employeeId, days) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    
    let balances = getEmployeeBalances(employeeId);
    balances = removeExpiredLeaves([...balances], currentYear);
    
    balances = applyLeaveRequest(days, balances, currentYear);
    
    updateEmployeeBalances(employeeId, balances);
  };

  useEffect(() => {
    // Clean expired balances periodically
    const currentYear = new Date().getFullYear();
    Object.keys(employeesBalances).forEach(employeeId => {
      let balances = employeesBalances[employeeId];
      balances = removeExpiredLeaves(balances, currentYear);
      if (JSON.stringify(balances) !== JSON.stringify(employeesBalances[employeeId])) {
        updateEmployeeBalances(employeeId, balances);
      }
    });
  }, []);

  return (
    <BalanceContext.Provider value={{
      employeesBalances,
      getEmployeeBalances,
      getEmployeeYearBalance,
      getEmployeeTotalBalance,
      updateEmployeeBalances,
      initializeEmployeeBalances,
      deductLeaveDays
    }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};

