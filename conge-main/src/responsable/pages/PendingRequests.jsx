import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { LEAVE_TYPE_LABELS } from '@/types/leave';
import { toast } from 'sonner';

const PendingRequests = () => {
const { user } = useAuth();
const { getPendingForManager, getPendingForDirector, updateRequestStatus } = useLeave();

const [selectedRequest, setSelectedRequest] = useState(null);
const [action, setAction] = useState(null);
const [comment, setComment] = useState('');

if (!user) return null;

const pendingRequests =
  user.role === 'manager'
    ? getPendingForManager()
    : user.role === 'director'
    ? getPendingForDirector()
    : [];

const handleAction = (request, actionType) => {
  setSelectedRequest(request);
  setAction(actionType);
};

const confirmAction = () => {
  if (!selectedRequest || !action) return;

  const newStatus =
    action === 'approve' ? 'pending_director' : 'rejected';

  updateRequestStatus(selectedRequest.id, newStatus, comment);

  setSelectedRequest(null);
  setAction(null);
  setComment('');
};

const isModalOpen = !!selectedRequest && !!action;

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-warning/10 p-3">
            <ClipboardList className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Demandes à valider</h1>
            <p className="text-muted-foreground">
              {pendingRequests.length} demande(s) en attente de votre validation
            </p>
          </div>
        </div>

        {/* Requests list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border bg-card shadow-sm"
        >
          {pendingRequests.length === 0 ? (
            <div className="py-16 text-center">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success/50" />
              <h3 className="text-lg font-medium">Tout est à jour !</h3>
              <p className="mt-2 text-muted-foreground">
                Aucune demande de congé en attente de validation
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
                    className="p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-medium">
{request.employeeName.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-semibold">{request.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {LEAVE_TYPE_LABELS[request.type]}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm">
                            <span>
                          {format(new Date(request.startDate), 'dd MMM', { locale: fr })} au{' '}
                      {format(new Date(request.endDate), 'dd MMM yyyy', { locale: fr })}
                            </span>
                            <span>⏱️ {request.duration} jours</span>
                          </div>
                          {request.reason && (
                            <p className="mt-2 rounded-lg bg-muted p-3 text-sm">
                              💬 {request.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                      <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        request.status === 'cancelled'
                          ? 'bg-gray-200 text-gray-700 border-gray-300'
                          : 'bg-warning/10 text-warning border-warning/20'
                      }`}
                    >
                      {request.status === 'cancelled' ? 'Annulée' : 'En attente'}
                    </span>
                        <p className="text-xs text-muted-foreground">
                          Demandé le {format(new Date(request.createdAt), 'dd/MM/yyyy', { locale: fr })}
                        </p>
                        <div className="flex gap-2">

                        {request.status !== 'cancelled' && (
                        <button
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-success text-success-foreground hover:bg-success/90 h-9 px-3 [&_svg]:size-4 [&_svg]:shrink-0"
                          onClick={() => handleAction(request, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Valider
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

        {/* Modal Overlay */}
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            onClick={() => {
              setSelectedRequest(null);
              setAction(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-auto mt-20 max-w-md rounded-xl border bg-card p-6 shadow-2xl"
            >
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {action === 'approve' 
                      ? 'Valider et transmettre au directeur'
                      : 'Refuser la demande'}
                  </h2>
                </div>
                {selectedRequest && (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="font-medium">{selectedRequest.employeeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {LEAVE_TYPE_LABELS[selectedRequest.type]} • {selectedRequest.duration} jours
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Du {format(new Date(selectedRequest.startDate), 'dd MMM', { locale: fr })} au{' '}
                      {format(new Date(selectedRequest.endDate), 'dd MMM yyyy', { locale: fr })}
                    </p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    <MessageSquare className="mr-1 inline h-4 w-4" />
                    Commentaire {action === 'reject' ? '(recommandé)' : '(facultatif)'}
                  </label>
                  <textarea
                    placeholder={action === 'reject' 
                      ? 'Expliquez le motif du refus...'
                      : 'Ajoutez un commentaire si nécessaire...'}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    onClick={() => {
                      setSelectedRequest(null);
                      setAction(null);
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmAction}
                    className={`inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${
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




