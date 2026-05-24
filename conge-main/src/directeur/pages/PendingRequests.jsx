import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle, XCircle, MessageSquare, Clock, Clock10Icon, AlarmClock, MessageCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { LEAVE_TYPE_LABELS } from '@/types/leave';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const PendingRequests = () => {
  const { user } = useAuth();
  const { getPendingForDirector, updateRequestStatus, validateLeave, isLoading } = useLeave();
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [action, setAction] = useState(null);
  const [comment, setComment] = useState('');

  const handleValidate = async (id) => {
    try {
      await validateLeave(id);
      toast.success("Demande validée");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur validation");
    }
  };

  if (!user) return null;

  const pendingRequests = user.role === 'directeur' 
    ? getPendingForDirector() 
    : [];

  const handleAction = (request, actionType) => {
    setSelectedRequest(request);
    setAction(actionType);
    setComment('');
  };

  const isModalOpen = !!selectedRequest && !!action;

  const getInitials = (nom, prenom) => {
    return `${nom?.charAt(0) || ""}${prenom?.charAt(0) || ""}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Chargement des demandes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 md:space-y-6 px-2 sm:px-4"
      >
        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="rounded-xl bg-warning/10 p-3 shrink-0">
            <ClipboardList className="h-5 w-5 md:h-6 md:w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Demandes à valider (Directeur)</h1>
            <p className="text-sm text-muted-foreground">
              {pendingRequests.length} demande(s) en attente de votre approbation finale
            </p>
          </div>
        </div>

        {/* Liste des demandes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card shadow-sm overflow-hidden"
        >
          {pendingRequests.length === 0 ? (
            <div className="py-12 md:py-16 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 md:h-16 md:w-16 text-success/50" />
              <h3 className="text-base md:text-lg font-medium">Tout est à jour !</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Aucune demande de congé en attente de votre validation finale
              </p>
            </div>
          ) : (
            <div className="divide-y">
              <AnimatePresence>
                {pendingRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 sm:p-6"
                  >
                    {/* Carte responsive : colonne sur mobile, ligne sur tablette/desktop */}
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                      {/* Partie gauche : avatar + infos */}
                      <div className="flex flex-1 flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-medium">
                          {getInitials(request.user?.nom, request.user?.prenom)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg truncate">{request.employeeName}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {LEAVE_TYPE_LABELS[request.type]}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs sm:text-sm">
                            <span className="whitespace-nowrap">
                              {format(new Date(request.startDate || request.start_date), "dd MMM", { locale: fr })} au{" "}
                              {format(new Date(request.endDate || request.end_date), "dd MMM yyyy", { locale: fr })}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlarmClock size={14} />
                              {request.duration} jours
                            </span>
                          </div>
                          {request.reason && (
                            <p className="mt-2 rounded-lg bg-muted p-2 sm:p-3 text-xs sm:text-sm flex items-start gap-2">
                              <MessageCircle size={14} className="shrink-0 mt-0.5" />
                              <span className="break-words">{request.reason}</span>
                            </p>
                          )}
                          {request.managerComment && (
                            <p className="mt-2 rounded-lg bg-primary/5 p-2 sm:p-3 text-xs sm:text-sm break-words">
                              <span className="font-medium">Commentaire du responsable :</span>{" "}
                              {request.managerComment}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Partie droite : badges et actions */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-end lg:items-end gap-3 shrink-0">
                        <div className="flex flex-wrap gap-2">
                          {request.user?.role === 'employee' && (
                            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary border-warning/20">
                              Approuvé par le responsable
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium bg-warning/10 text-warning border-warning/20">
                            En attente
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          Demandé le {format(new Date(request.createdAt || request.created_at), "dd/MM/yyyy", { locale: fr })}
                        </p>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                          <button
                            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-md text-sm font-medium border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 h-9 px-3"
                            onClick={() => navigate(`/demande/${request.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            Détail
                          </button>
                          {request.status !== "cancelled" && (
                            <button
                              className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-md text-sm font-medium bg-success text-success-foreground hover:bg-success/90 h-9 px-3"
                              onClick={() => handleAction(request, "approve")}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approuver
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Modal responsive */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md rounded-xl border bg-card p-4 sm:p-6 shadow-2xl"
            >
              <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-semibold">
                  {action === 'approve'
                    ? 'Approuver définitivement la demande'
                    : 'Refuser la demande'}
                </h2>
                {selectedRequest && (
                  <div className="rounded-lg bg-muted p-3 sm:p-4">
                    <p className="font-medium text-sm sm:text-base">{selectedRequest.employeeName}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {LEAVE_TYPE_LABELS[selectedRequest.type]} • {selectedRequest.duration} jours
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Du {format(new Date(selectedRequest.startDate || selectedRequest.start_date), 'dd MMM', { locale: fr })} au{' '}
                      {format(new Date(selectedRequest.endDate || selectedRequest.end_date), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    Commentaire {action === 'reject' ? '(recommandé)' : '(facultatif)'}
                  </label>
                  <textarea
                    placeholder={action === 'reject'
                      ? 'Expliquez le motif du refus...'
                      : 'Ajoutez un commentaire si nécessaire...'}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <button
                    type="button"
                    className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent h-10 px-4 py-2"
                    onClick={() => {
                      setSelectedRequest(null);
                      setAction(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      handleValidate(selectedRequest.id);
                      setSelectedRequest(null);
                      setAction(null);
                    }}
                    className={`flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 ${
                      action === 'approve'
                        ? 'bg-success text-success-foreground hover:bg-success/90'
                        : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    }`}
                  >
                    {action === 'approve' ? 'Confirmer' : 'Refuser'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default PendingRequests;