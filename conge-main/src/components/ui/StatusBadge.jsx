import { cn } from '@/lib/utils';
import { LEAVE_STATUS_LABELS } from '@/types/leave';

export const StatusBadge = ({ status, className}) => {
  const variants = {
    en_attente: 'bg-warning/10 text-warning border-warning/20',
    valide_responsable: 'bg-primary/10 text-primary border-primary/20',
    valide_directeur: 'bg-success/10 text-success border-success/20',
    refuse: 'bg-destructive/10 text-destructive border-destructive/20',
  };

  const labels = {
    en_attente: 'En attente',
    valide_responsable: 'Validé responsable',
    valide_directeur: 'Validé directeur',
    refuse: 'Refusé',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
};

