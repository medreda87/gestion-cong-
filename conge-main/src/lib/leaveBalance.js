/**
 * Leave Balance Utilities
 */

// Monthly accumulation rate (22 days/year / 12)
const MONTHLY_RATE = 1.83;

export const calculateMonthlyLeaveBalance = (currentDate, hireDate = null) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12
  
  let monthsWorked = month;
  
  if (hireDate) {
    const hireYear = hireDate.getFullYear();
    const hireMonth = hireDate.getMonth() + 1;
    monthsWorked = (year - hireYear) * 12 + (month - hireMonth) + 1;
  }
  
  const earned = monthsWorked * MONTHLY_RATE;
  return Math.floor(earned);
};

export const removeExpiredLeaves = (balances, currentYear) => {
  return balances.filter(balance => {
    const age = currentYear - balance.year;
    return age <= 2;
  });
};

export const applyLeaveRequest = (requestedDays, balances, currentYear) => {
  let remainingDays = requestedDays;
  
  // First use previous year balances (N-1 and older valid)
  const previousBalances = balances.filter(b => b.year < currentYear).sort((a, b) => b.year - a.year);
  
  for (let balance of previousBalances) {
    if (remainingDays <= 0) break;
    
    const available = balance.earnedDays - balance.usedDays;
    if (available > 0) {
      const deduct = Math.min(available, remainingDays);
      balance.usedDays += deduct;
      remainingDays -= deduct;
    }
  }
  
  // Then use current year balance
  if (remainingDays > 0) {
    const currentBalance = balances.find(b => b.year === currentYear);
    if (currentBalance) {
      const available = currentBalance.earnedDays - currentBalance.usedDays;
      const deduct = Math.min(available, remainingDays);
      currentBalance.usedDays += deduct;
    }
  }
  
  return balances;
};

export const getTotalAvailableBalance = (balances, currentDate) => {
  const currentYear = currentDate.getFullYear();
  
  // Remove expired
  let validBalances = removeExpiredLeaves([...balances], currentYear);
  
  let total = 0;
  for (let balance of validBalances) {
    const earned = balance.earnedDays || calculateMonthlyLeaveBalance(currentDate, balance.hireDate);
    total += earned - balance.usedDays;
  }
  
  return Math.floor(total);
};

// Example usage outputs
export const examples = {
  month3: calculateMonthlyLeaveBalance(new Date(2026, 2, 1)), // March -> 5
  month6: calculateMonthlyLeaveBalance(new Date(2026, 5, 1)), // June -> 11
  month12: calculateMonthlyLeaveBalance(new Date(2026, 11, 1)), // Dec -> 22
};
