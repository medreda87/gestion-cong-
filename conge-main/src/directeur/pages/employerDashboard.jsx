import { useLeave } from '../../contexts/LeaveContext';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCardd'; 
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, Clock, CheckCircle, Users } from 'lucide-react';
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
  const { requests } = useLeave(); 

  const directorRequests = requests.filter((r) =>
    ['pending_director', 'approved', 'rejected'].includes(r.status)
  );

  console.log(
  directorRequests.filter(r => r.type === 'administratif')
);

  const total = directorRequests.length;

  const pending = directorRequests.filter(
    (r) => r.status === 'pending_director'
  ).length;

  const approved = directorRequests.filter(
    (r) => r.status === 'approved'
  ).length;

  const refused = directorRequests.filter(
    (r) => r.status === 'rejected'
  ).length;

  const uniqueEmployees = new Set(
    directorRequests.map((r) => r.employeeId)
  ).size;

  // ✅ mapping status
  const mapStatus = (status) => {
    switch (status) {
      case 'pending_director':
        return 'en_attente';

      case 'approved':
        return 'valide_directeur';

      case 'rejected':
        return 'refuse';

      default:
        return 'en_attente';
    }
  };

  // ✅ charts data
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

  const sortedRequests = [...directorRequests].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
          description="Vue d'ensemble des demandes nécessitant votre validation"
        />

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <StatCard
            title="Total Demandes"
            value={total}
            icon={<BarChart3 className="h-5 w-5" />}
            variant="primary"
          />
          <StatCard
            title="En attente (Directeur)"
            value={pending}
            icon={<Clock className="h-5 w-5" />}
            variant="warning"
          />
          <StatCard
            title="Approuvées"
            value={approved}
            icon={<CheckCircle className="h-5 w-5" />}
            variant="success"
          />
          <StatCard
            title="Employés concernés"
            value={uniqueEmployees}
            icon={<Users className="h-5 w-5" />}
            variant="info"
          />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl border p-6"
          >
            <h3 className="mb-4 font-semibold">Répartition par Statut</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-card rounded-xl border p-6"
          >
            <h3 className="mb-4 font-semibold">Demandes par Type</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
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

        {/* Table */}
        <motion.div variants={itemVariants}>
          <h3 className="mb-4 font-semibold">Dernières Demandes</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedRequests.slice(0, 8).map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.employeeName}</TableCell>
                  <TableCell>{req.type}</TableCell>
                  <TableCell>
                    {req.startDate} → {req.endDate}
                  </TableCell>
                  <TableCell>{req.duration}j</TableCell>
                  <TableCell>
                    <StatusBadge status={mapStatus(req.status)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}