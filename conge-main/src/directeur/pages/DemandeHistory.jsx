import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Filter, Calendar, Search } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useLeave } from '@/contexts/LeaveContext';
import { LEAVE_TYPE_LABELS } from '@/types/leave';
import { Link } from 'react-router-dom';

const LeaveHistory = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { getRequestsByEmployee, updateRequestStatus,requests } = useLeave();  if (!user) return null;
  
  const LEAVE_STATUS_LABELS = {
  pending_manager: user.role === 'manager' ? 'En attente (Directeur)' : 'En attente (Responsable)',
  pending_director: 'En attente (Directeur)',
  approved: 'Approuvé',
  cancelled: 'Annulé',
};
  console.log(requests.map(r => r.status));
  
  const filteredRequests = requests.filter(request => {
    const matchFilter = request.status === 'approved';
    const typeLabel = LEAVE_TYPE_LABELS[request.type] || "";
    const matchesSearch = 
      typeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.reason?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchFilter && matchesSearch ;
  });

  const getStatusBadgeClass = (status) => {
    const variants = {
      pending_manager: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-warning/10 text-warning border-warning/20',
      pending_director: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border-primary/20',
      approved: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success border-success/20',
      rejected: 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-destructive/10 text-destructive border-destructive/20',
      cancelled: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 border-gray-300",
    };
    return variants[status] || 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <History className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Historique des congés</h1>
              <p className="text-muted-foreground">
               Consultez les congés validés
              </p>
            </div>
          </div>
         
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 rounded-xl border bg-card p-4"
        >
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Rechercher par type ou par motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
          </div>
         
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card shadow-sm"
        >
          {filteredRequests.length === 0 ? (
            <div className="py-16 text-center">
              <Calendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />
              <h3 className="text-lg font-medium">Aucune demande trouvée</h3>
              <p className="mt-2 text-muted-foreground">
                {filteredRequests.length === 0
                  ? "Vous n'avez pas encore fait de demande de congé"
                  : 'Aucune demande ne correspond à vos critères de recherche'}
              </p>
              
            </div>
          ) : (
            <div className="divide-y">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-lg p-3 ${
                      request.status === 'approved' ? 'bg-success/10' :
                      request.status === 'rejected' ? 'bg-destructive/10' :
                      'bg-warning/10'
                    }`}>
                      <Calendar className={`h-5 w-5 ${
                        request.status === 'approved' ? 'text-success' :
                        request.status === 'rejected' ? 'text-destructive' :
                        'text-warning'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{LEAVE_TYPE_LABELS[request.type]}</p>
                      <p className="text-sm text-muted-foreground">
                        Du {format(new Date(request.start_date), 'dd MMMM', { locale: fr })} au{' '}
                        {format(new Date(request.end_date), 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      {request.reason && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Motif: {request.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-semibold">{request.duration} jours</p>
                      <p className="text-xs text-muted-foreground">
                        Créé le {format(new Date(request.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <span className={getStatusBadgeClass(request.status)}>
                      {LEAVE_STATUS_LABELS[request.status]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

     
      </motion.div>
    </DashboardLayout>
  );
};

export default LeaveHistory;

