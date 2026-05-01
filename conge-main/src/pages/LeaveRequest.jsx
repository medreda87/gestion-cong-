import { useState } from 'react';

const initialEmployees = [
  { id: '1', name: 'Ahmed El Mansouri', department: 'Formation' },
  { id: '2', name: 'Fatima Benali', department: 'Administration' },
  { id: '3', name: 'Mohammed Alaoui', department: 'Formation' },
  { id: '4', name: 'Sara Tazi', department: 'RH' },
  { id: '5', name: 'Youssef Idrissi', department: 'Technique' },
  { id: '6', name: 'Khadija Moussaoui', department: 'Direction' },
];

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarPlus, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, differenceInBusinessDays, addDays, isBefore } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fr } from 'date-fns/locale';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { LEAVE_TYPE_LABELS } from '@/types/leave';
import { toast } from 'sonner';
import { useEffect } from 'react';

const LeaveRequest = () => {
  const { user } = useAuth();
  const { addRequest } = useLeave();
  const navigate = useNavigate();

  const [type, setType] = useState('administratif');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subType, setSubType] = useState(''); 
  const [interimaireId, setInterimaireId] = useState('');

  if (!user) return null;

  
  const EXCEPTIONAL_DURATIONS = {
    "Mariage de l'agent": 5,
    "Manage d'un descendante": 2,
    "Naissance d'un enfant": 3,
    "Décés d'un conjoint ou d'un enfant": 3,
    "Décés d'un ascendant,d'un frére ou d'un soeur": 2,
    "Cironcision d'un enfant": 2,
    "Hospitalisation d'un conjoint ou d'un enfant": 1,
  };

  const today = new Date();
  const minDate = format(addDays(today,8), 'yyyy-MM-dd');

const calculateDuration = () => {
  if (type === 'exceptional' && subType) {
    return EXCEPTIONAL_DURATIONS[subType] || 0;
  }
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isBefore(end, start)) return 0;
  return differenceInBusinessDays(end, start) + 1;
};
  const totall=()=>{
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    const days = diff / (1000 * 60 * 60 * 24);
    return days+1;
  }


  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  const balances = user?.balances || [];

// نجيبو balance ديال العام الحالي
const currentBalance = balances.find(
  (b) => b.year === currentYear
);

// نجيبو balance ديال العام اللي فات
const previousBalance = balances.find(
  (b) => b.year === previousYear
);

// نحسبو solde لكل عام
const currentSolde =
  (currentBalance?.earnedDays || 0) -
  (currentBalance?.usedDays || 0);

const previousSolde =
  (previousBalance?.earnedDays || 0) -
  (previousBalance?.usedDays || 0);

  // المجموع
  const totalSolde = currentSolde + previousSolde;
  const duration = calculateDuration();
  const total=totall()
  const isValidDuration = (type !== 'exceptional' ? duration > 0 && duration <= totalSolde : duration > 0);
  const isDateValid = startDate && new Date(startDate) >= addDays(today,7);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!isDateValid) {
    toast.error("La demande doit être faite au moins 8 jours avant le début du congé");
    return;
  }

  if (!isValidDuration) {
    toast.error("Durée invalide ou solde insuffisant");
    return;
  }

  try {
    setIsSubmitting(true);

    await addRequest({
      type,
      start_date: startDate,
      end_date: endDate,
      duration: duration,
      sub_type: type === "exceptional" ? subType : null,
      reason: reason || null,
      interimaire_id: interimaireId || null,
    });

    toast.success("Demande soumise avec succès !");
    navigate("/history");
  } catch (error) {
    toast.error("Erreur lors de la création de la demande");
    console.error(error.response?.data || error.message);
  } finally {
    setIsSubmitting(false);
  }
};

const HOLIDAYS = [
  '2026-01-01',
  '2026-01-11',
  '2026-05-01',
  '2026-07-30',
];

const isWorkingDay = (date) => {
  const day = date.getDay();
  const formatted = format(date, 'yyyy-MM-dd');

  const isWeekend = day === 0 || day === 6;
  const isHoliday = HOLIDAYS.includes(formatted);

  return !isWeekend && !isHoliday;
};

const calculateEndDate = (startDate, days) => {
  let current = new Date(startDate);
  let count = 0;

  while (count < days) {
    if (isWorkingDay(current)) {
      count++;
    }
    if (count < days) {
      current = addDays(current, 1);
    }
  }

  return current;
};

useEffect(() => {
  if (type === 'exceptional' && subType && startDate) {
    const days = EXCEPTIONAL_DURATIONS[subType] || 0;

    const end = calculateEndDate(startDate, days);

    setEndDate(format(end, 'yyyy-MM-dd'));
  }
}, [type, subType, startDate]);


  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-2xl"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <CalendarPlus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Nouvelle demande de congé</h1>
              <p className="text-muted-foreground">
                Remplissez le formulaire pour soumettre votre demande
              </p>
            </div>
          </div>
        </div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border bg-primary/5 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Votre solde de congés</p>
              <p className="text-2xl font-bold text-primary">{totalSolde} jours</p>
            </div>
            {duration > 0 && type !== 'exceptional' && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Après cette demande</p>
                <p className={`text-2xl font-bold ${isValidDuration ? 'text-success' : 'text-destructive'}`}>
                  {totalSolde - duration} jours
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-xl border bg-card p-6 shadow-sm"
        >
          <div className="space-y-6">
            {/* Leave type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Type de congé *
              </label>
              <div className="relative">
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  required
                >
                  {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
 {type === 'exceptional' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label htmlFor="subType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Sous-type de congé exceptionnel *
                </label>
                <div className="relative">
                  <select
                    id="subType"
                    value={subType}
                    onChange={(e) => setSubType(e.target.value)}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    required
                  >
                    <option value="">Sélectionnez un sous-type</option>
                    <option value="Mariage de l'agent">Mariage de l'agent -- 5 jours</option>
                    <option value="Manage d'un descendante">Manage d'un descendante -- 2 jours</option>
                    <option value="Naissance d'un enfant">Naissance d'un enfant -- 3 jours</option>
                    <option value="Décés d'un conjoint ou d'un enfant">Décés d'un conjoint ou d'un enfant -- 3 jours</option>
                    <option value="Décés d'un ascendant,d'un frére ou d'un soeur">Décés d'un ascendant,d'un frére ou d'un soeur  -- 2 jours</option>
                    <option value="Cironcision d'un enfant">Cironcision d'un enfant -- 2 jours</option>
                    <option value="Hospitalisation d'un conjoint ou d'un enfant">Hospitalisation d'un conjoint ou d'un enfant -- 1 jours</option>
                  </select>
                </div>
              </motion.div>
            )}
            {/* Dates */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Date de début *
                </label>
                <input
              id="startDate"
              type="date"
              min={minDate}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onFocus={(e) => e.currentTarget.showPicker?.()}
              className="flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Date de fin *
                </label>
               <input
              id="endDate"
              type="date"
              disabled={type === "exceptional"}
              min={startDate || minDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onFocus={(e) => e.currentTarget.showPicker?.()}
              className="flex h-10 w-full cursor-pointer appearance-none rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            />
              </div>
            </div>

            {/* Duration display */}
            {duration > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className={`flex flex-col gap-2 rounded-lg p-3 ${
                  isValidDuration
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isValidDuration ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5" />
                  )}

                  <span className="text-sm font-medium">
                    {type === 'exceptional' ? `Durée fixe: ${duration} jours (${subType})` : `Durée des jours de congé : ${duration}`}
                    {!isValidDuration && " - Solde insuffisant"}
                  </span>
                </div>

                <span className="text-primary text-sm font-medium">
                  Durée totale des jours : {total}
                </span>
              </motion.div>
            )}

            {/* Warning for date */}
            {startDate && !isDateValid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 rounded-lg bg-warning/10 p-3 text-warning"
              >
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm">
                  La demande doit être faite au moins 8 jours avant le début du congé
                </span>
              </motion.div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Motif (facultatif)
              </label>
              <textarea
                id="reason"
                placeholder="Décrivez la raison de votre demande..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Interimaire */}
            <div className="space-y-2">
              <label htmlFor="interimaire" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Interimaire (facultatif)
              </label>
              <Select value={interimaireId} onValueChange={setInterimaireId}>
                <SelectTrigger id="interimaire" className="w-full h-10">
                  <SelectValue placeholder="Sélectionner un interimaire (même département)" />
                </SelectTrigger>
                <SelectContent>
                  {initialEmployees
                    .filter(emp => emp.department === user.department && emp.id !== user.id)
                    .map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </SelectItem>
                    )) || <SelectItem value="" disabled>Aucun interimaire disponible dans votre département</SelectItem>}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 [&_svg]:size-4 [&_svg]:shrink-0"
                onClick={() => navigate('/dashboard')}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={!isValidDuration || !isDateValid || isSubmitting}
                className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 [&_svg]:size-4 [&_svg]:shrink-0"
              >
                {isSubmitting ? 'Envoi...' : 'Soumettre la demande'}
              </button>
            </div>
          </div>
        </motion.form>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground"
        >
          <p className="font-medium text-foreground">Processus de validation :</p>
          <ol className="mt-2 list-inside list-decimal space-y-1">
            <li>Votre demande sera envoyée au responsable d'entité</li>
            <li>Après validation, elle sera transmise au directeur</li>
            <li>Vous recevrez une notification à chaque étape</li>
          </ol>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default LeaveRequest;

