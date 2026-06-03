import { useState, useMemo } from 'react';
import { useLeave } from '../../contexts/LeaveContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCardd'; 
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, Clock, CheckCircle, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

// Animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

// Composant Skeleton (responsif)
const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-7 sm:h-8 w-48 sm:w-64 bg-slate-200 rounded"></div>
      <div className="h-4 w-64 sm:w-80 bg-slate-100 rounded"></div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-card rounded-xl border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="h-7 w-7 sm:h-8 sm:w-8 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-14 sm:w-16 bg-slate-200 rounded"></div>
          </div>
          <div className="h-6 sm:h-7 w-14 sm:w-16 bg-slate-200 rounded"></div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card rounded-xl border p-4 sm:p-6">
        <div className="h-5 w-28 bg-slate-200 rounded mb-4"></div>
        <div className="h-48 sm:h-64 bg-slate-100 rounded"></div>
      </div>
      <div className="bg-card rounded-xl border p-4 sm:p-6">
        <div className="h-5 w-28 bg-slate-200 rounded mb-4"></div>
        <div className="h-48 sm:h-64 bg-slate-100 rounded"></div>
      </div>
    </div>

    <div>
      <div className="h-5 w-36 bg-slate-200 rounded mb-4"></div>
      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="bg-slate-50">
              <tr>
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-4 py-2 sm:px-6 sm:py-3"><div className="h-4 w-16 bg-slate-200 rounded"></div></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, idx) => (
                <tr key={idx} className="border-t">
                  {[...Array(5)].map((_, j) => (
                    <td key={j} className="px-4 py-2 sm:px-6 sm:py-4"><div className="h-5 w-20 bg-slate-100 rounded"></div></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default function DirecteurDashboard() {
  const { requests, isLoading } = useLeave();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const directorRequests = requests.filter((r) =>
    ['pending_director', 'approved', 'rejected'].includes(r.status)
  );

  const total = directorRequests.length;
  const pending = directorRequests.filter((r) => r.status === 'pending_director').length;
  const approved = directorRequests.filter((r) => r.status === 'approved').length;
  const refused = directorRequests.filter((r) => r.status === 'rejected').length;
  const uniqueEmployees = new Set(directorRequests.map((r) => r.employeeId)).size;

  const pieData = [
    { name: 'En attente (Directeur)', value: pending, color: '#f59e0b' },
    { name: 'Approuvées', value: approved, color: '#10b981' },
    { name: 'Refusées', value: refused, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const typeData = [
    {
      name: 'Administratif',
      count: directorRequests.filter((r) => r.type === 'administratif').length,
      color: '#3b82f6',
    },
    {
      name: 'Exceptionnel',
      count: directorRequests.filter((r) => r.type === 'exceptional').length,
      color: '#8b5cf6',
    },
  ];

  const sortedRequests = useMemo(() => {
    return [...directorRequests].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [directorRequests]);

  const totalPages = Math.ceil(sortedRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const mapStatus = (status) => {
    switch (status) {
      case 'pending_director': return 'en_attente';
      case 'approved': return 'valide_directeur';
      case 'rejected': return 'refuse';
      default: return 'en_attente';
    }
  };

  // Helper pour formater les dates courtes sur mobile
  const formatDateShort = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return dateStr;
  };

  return (
    <DashboardLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-5 sm:space-y-6 px-2 sm:px-0"
      >
        <PageHeader
          title="Tableau de Bord Directeur"
          description="Vue d'ensemble des demandes nécessitant votre validation"
        />

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          <StatCard title="Total Demandes" value={total} icon={<BarChart3 className="h-5 w-5" />} variant="primary" />
          <StatCard title="En attente (Directeur)" value={pending} icon={<Clock className="h-5 w-5" />} variant="warning" />
          <StatCard title="Approuvées" value={approved} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
          <StatCard title="Employés concernés" value={uniqueEmployees} icon={<Users className="h-5 w-5" />} variant="info" />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants} className="bg-card rounded-xl border p-4 sm:p-6">
            <h3 className="mb-4 font-semibold text-sm sm:text-base">Répartition par Statut</h3>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" labelLine={false}>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-card rounded-xl border p-4 sm:p-6">
            <h3 className="mb-4 font-semibold text-sm sm:text-base">Demandes par Type</h3>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {typeData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Tableau avec Pagination */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-base sm:text-lg">Dernières Demandes</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-muted-foreground">Lignes par page :</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-xs sm:text-sm"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>

          {/* Conteneur scrollable horizontalement pour le tableau */}
          <div className="border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Employé</TableHead>
                    <TableHead className="text-xs sm:text-sm">Type</TableHead>
                    <TableHead className="text-xs sm:text-sm">Dates</TableHead>
                    <TableHead className="text-xs sm:text-sm">Durée</TableHead>
                    <TableHead className="text-xs sm:text-sm">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="text-xs sm:text-sm">{req.user?.nom_prenom || '---'}</TableCell>
                      <TableCell className="text-xs sm:text-sm capitalize">{req.type}</TableCell>
                      <TableCell className="text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal">
                        <span className="sm:hidden">
                          {formatDateShort(req.start_date)} → {formatDateShort(req.end_date)}
                        </span>
                        <span className="hidden sm:inline">
                          {req.start_date} → {req.end_date}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">{req.duration}j</TableCell>
                      <TableCell><StatusBadge status={mapStatus(req.status)} /></TableCell>
                    </TableRow>
                  ))}
                  {paginatedRequests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                        Aucune demande trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination Controls */}
          {sortedRequests.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
              <div className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, sortedRequests.length)} sur {sortedRequests.length}
              </div>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded border disabled:opacity-50 hover:bg-accent transition-colors"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm">
                  Page {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded border disabled:opacity-50 hover:bg-accent transition-colors"
                  aria-label="Page suivante"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}