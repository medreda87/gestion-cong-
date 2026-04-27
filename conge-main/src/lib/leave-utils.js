export function calculateWorkingDays(start, end, holidays) {
  let count = 0;
  const holidayDates = new Set(holidays.map(h => h.date));
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    const dateStr = current.toISOString().split('T')[0];

    if (day !== 0 && day !== 6 && !holidayDates.has(dateStr)) {
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  return count;
}

export function getMinStartDate() {
  const d = new Date();
  d.setDate(d.getDate() + 8);
  return d;
}

export function calculateBalance(startDate) {
  const start = new Date(startDate);
  const now = new Date();

  const monthsWorked = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  );

  if (monthsWorked < 6) {
    return { currentYear: 0, previousYear: 0, total: 0 };
  }

  const yearsWorked = Math.floor(monthsWorked / 12);
  const remainingMonths = monthsWorked % 12;

  let currentYear = 0;

  const monthsInCurrentCycle = remainingMonths;

  currentYear =
    monthsInCurrentCycle >= 6
      ? Math.round((monthsInCurrentCycle / 12) * 22)
      : 0;

  if (monthsInCurrentCycle === 0 && yearsWorked > 0) {
    currentYear = 22;
  }

  const previousYear = yearsWorked >= 1 ? 22 : 0;

  return {
    currentYear: Math.min(currentYear, 22),
    previousYear: Math.min(previousYear, 22),
    total:
      Math.min(currentYear, 22) + Math.min(previousYear, 22),
  };
}

export function getStatusLabel(status) {
  const labels = {
    en_attente: 'En Attente',
    valide_responsable: 'Validé Responsable',
    valide_directeur: 'Validé Directeur',
    refuse: 'Refusé',
  };

  return labels[status] || status;
}

export function getStatusColor(status) {
  const colors = {
    en_attente: 'bg-warning/10 text-warning',
    valide_responsable: 'bg-info/10 text-info',
    valide_directeur: 'bg-success/10 text-success',
    refuse: 'bg-destructive/10 text-destructive',
  };

  return colors[status] || '';
}