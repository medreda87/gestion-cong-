// Leave type definitions
export const LeaveType = ['administratif','exceptional'];
export const LeaveStatus = ['pending_manager', 'pending_director', 'approved', 'rejected'];

export const LEAVE_TYPE_LABELS = {
  administratif: 'Congé administratif',
  exceptional: 'Congé exceptionnel',
  
};

export const LEAVE_STATUS_LABELS = {
  pending_manager: 'En attente (Responsable)',
  pending_director: 'En attente (Directeur)',
  approved: 'Approuvé',
  rejected: 'Refused',
  cancelled: "Annulé"
};

export const UserRole = {
  EMPLOYEE: 'employee',
  RESPONSABLE: 'responsable',
  DIRECTEUR: 'directeur',
};



export const ExceptionalReason = {
  MARIAGE: 'mariage',
  NAISSANCE: 'naissance',
  DECES: 'deces',
  AUTRE: 'autre',
};

export const RequestStatus = {
  EN_ATTENTE: 'en_attente',
  VALIDE_RESPONSABLE: 'valide_responsable',
  VALIDE_DIRECTEUR: 'valide_directeur',
  REFUSE: 'refuse',
};

