import { useData } from '@/contexts/DataContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCardd'; 
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, Clock, CheckCircle, Users, CalendarDays, Filter } from 'lucide-react';
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

export default function DirecteurDashboard() {
  const { requests } = useData();

  // === LOGIQUE TOTALE CONSERVÉE ===
  const total = requests.length;
  const pending = requests.filter(
    (r) => r.status === 'en_attente' || r.status === 'valide_responsable'
  ).length;
  const approved = requests.filter((r) => r.status === 'valide_directeur').length;
  const refused = requests.filter((r) => r.status === 'refuse').length;
  const uniqueEmployees = new Set(requests.map((r) => r.employeeId)).size;

  const pieData = [
    { name: 'En attente', value: pending, color: '#f59e0b' },
    { name: 'Approuvées', value: approved, color: '#10b981' },
    { name: 'Refusées', value: refused, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  const typeData = [
    {
      name: 'Administratif',
      count: requests.filter((r) => r.type === 'administratif').length,
      color: '#3b82f6',
    },
    {
      name: 'Exceptionnel',
      count: requests.filter((r) => r.type === 'exceptionnel').length,
      color: '#8b5cf6',
    },
  ];

  // Tri conservé
  const sortedRequests = [...requests].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <DashboardLayout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <PageHeader
          title="Tableau de Bord Directeur"
          description="Vue d'ensemble de la gestion des congés de l'établissement"
        />

        {/* Cartes statistiques */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <StatCard
            title="Total Demandes"
            value={total}
            icon={<BarChart3 className="h-5 w-5" />}
            variant="primary"
            trend={total > 0 ? "+12% vs mois dernier" : undefined}
          />
          <StatCard
            title="En Attente"
            value={pending}
            icon={<Clock className="h-5 w-5" />}
            variant="warning"
            trend={pending > 0 ? `${pending} à traiter` : undefined}
          />
          <StatCard
            title="Approuvées"
            value={approved}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
          />
          <StatCard
            title="Employés Actifs"
            value={uniqueEmployees}
            icon={<Users className="h-5 w-5" />}
            variant="info"
          />
        </motion.div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart - sans labelLine */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Répartition par Statut</h3>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                   
                    // labelLine a été supprimé
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bar chart */}
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Demandes par Type</h3>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} barSize={80}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {typeData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Tableau des dernières demandes */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">Dernières Demandes</h3>
            <span className="text-xs text-muted-foreground">
              {sortedRequests.length > 8
                ? `Affichage des 8 dernières sur ${sortedRequests.length}`
                : `${sortedRequests.length} demande(s)`}
            </span>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Employé</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Dates</TableHead>
                    <TableHead className="font-semibold">Durée</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <CalendarDays className="h-12 w-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">Aucune demande de congé</p>
                          <p className="text-sm text-muted-foreground/70">
                            Les demandes apparaîtront ici une fois soumises
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedRequests.slice(0, 8).map((req) => (
                      <TableRow
                        key={req.id}
                        className="hover:bg-muted/30 transition-colors duration-150"
                      >
                        <TableCell className="font-medium">
                          {req.employeeName || `Employé #${req.employeeId?.slice(0, 6)}`}
                        </TableCell>
                        <TableCell className="capitalize">{req.type}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {req.startDate} → {req.endDate}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                            {req.duration}j
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={req.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}