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

const LEAVE_STATUS_LABELS = {
  pending_manager: 'En attente (Responsable)',
  pending_director: 'En attente (Directeur)',
  approved: 'Approuvé',
  cancelled: 'Annulé',
};

const LeaveHistory = () => {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { getRequestsByEmployee, updateRequestStatus } = useLeave();  if (!user) return null;

  const myRequests = getRequestsByEmployee(user.id);

  const filteredRequests = myRequests.filter((request) => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const typeLabel = LEAVE_TYPE_LABELS[request.type] || "";
    const matchesSearch = 
      typeLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.reason?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
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
                Consultez toutes vos demandes de congés
              </p>
            </div>
          </div>
          <Link to="/request">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 [&_svg]:size-4 [&_svg]:shrink-0">
              <Calendar className="h-4 w-4" />
              Nouvelle demande
            </button>
          </Link>
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
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-[200px] cursor-default select-none items-center justify-between rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(LEAVE_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
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
                {myRequests.length === 0
                  ? "Vous n'avez pas encore fait de demande de congé"
                  : 'Aucune demande ne correspond à vos critères de recherche'}
              </p>
              {myRequests.length === 0 && (
                <Link to="/request">
                  <button className="mt-4 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 [&_svg]:size-4 [&_svg]:shrink-0">
                    Faire une demande
                  </button>
                </Link>
              )}
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
                        Du {format(new Date(request.startDate), 'dd MMMM', { locale: fr })} au{' '}
                        {format(new Date(request.endDate), 'dd MMMM yyyy', { locale: fr })}
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
                        Créé le {format(new Date(request.createdAt), 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <span className={getStatusBadgeClass(request.status)}>
                      {LEAVE_STATUS_LABELS[request.status]}
                    </span>

                    {/* Bouton Annuler */}
                  {request.status === 'pending_manager' && (
                  <button
                    onClick={() => {
                      if (confirm("Voulez-vous vraiment annuler cette demande ?")) {
                        updateRequestStatus(request.id, "cancelled");
                      }
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Annuler
                  </button>
                )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {myRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4 sm:grid-cols-4"
          >
            {[
              { label: 'Total', count: myRequests.length, color: 'bg-muted' },
              { label: 'En attente', count: myRequests.filter((r) => r.status.startsWith('pending')).length, color: 'bg-warning/10' },
              { label: 'Approuvées', count: myRequests.filter((r) => r.status === 'approved').length, color: 'bg-success/10' },
              { label: 'Refusées', count: myRequests.filter((r) => r.status === 'cancelled').length, color: 'bg-gray/100' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-lg ${stat.color} p-4 text-center`}>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default LeaveHistory;

