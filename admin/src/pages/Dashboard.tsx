import { FileText, Users, CheckCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { MonthlyLeaveChart, LeaveTypePieChart } from "@/components/dashboard/LeaveChart";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { PendingRequests } from "@/components/dashboard/PendingRequests";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">
          Vue d'ensemble de la gestion des congés
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Demandes en attente"
          value={8}
          subtitle="À traiter"
          icon={Clock}
          variant="warning"
        />
        <StatCard
          title="Congés approuvés"
          value={45}
          subtitle="Ce mois"
          icon={CheckCircle}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total employés"
          value={156}
          subtitle="Actifs"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Demandes ce mois"
          value={53}
          subtitle="Toutes catégories"
          icon={FileText}
          variant="default"
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <MonthlyLeaveChart />
        <LeaveTypePieChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PendingRequests />
        <AlertsPanel />
      </div>
    </div>
  );
}
