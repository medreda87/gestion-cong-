import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Filter, Search, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLeave } from "@/contexts/LeaveContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const STATUS_LABELS = {
  pending_manager: "En attente (Responsable)",
  pending_director: "En attente (Directeur)",
  approved: "Approuvé",
  rejected: "Refusé",
};

const Absences = () => {
  const { user } = useAuth();
  const { requests = [] } = useLeave();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) return null;

  const exceptionalRequests = requests.filter(
    (r) => r.type === "exceptionnel" || r.type === "exceptional"
  );

  const filteredRequests = exceptionalRequests.filter((request) => {
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    const matchesSearch =
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    const variants = {
      pending_manager:
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-warning/10 text-warning border-warning/20",
      pending_director:
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary border-primary/20",
      approved:
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success border-success/20",
      rejected:
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-destructive/10 text-destructive border-destructive/20",
    };
    return variants[status];
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
            <div className="rounded-xl bg-warning/10 p-3">
              <AlertTriangle className="h-6 w-6 text-warning" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Absences exceptionnelles
              </h1>
              <p className="text-muted-foreground">
                Suivi des congés exceptionnels
              </p>
            </div>
          </div>

          <Link to="/request">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
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
                className="h-10 w-full rounded-md border px-9"
              />
            </div>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 w-[200px] rounded-md border px-8"
            >
              <option value="all">Tous les statuts</option>

              {Object.entries(STATUS_LABELS).map(([value, label]) => (
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
          className="rounded-xl border bg-card shadow-sm"
        >
          {filteredRequests.length === 0 ? (
            <div className="py-16 text-center">
              <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />

              <h3 className="text-lg font-medium">
                Aucune absence exceptionnelle
              </h3>

              <p className="mt-2 text-muted-foreground">
                Créez une demande exceptionnelle pour commencer
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
                    <div
                      className={`rounded-lg p-3 ${
                        request.status === "approved"
                          ? "bg-success/10"
                          : request.status === "rejected"
                          ? "bg-destructive/10"
                          : "bg-warning/10"
                      }`}
                    >
                      <Calendar className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-medium">
                        Absence exceptionnelle
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Du{" "}
                        {format(
                          new Date(request.startDate),
                          "dd MMMM",
                          { locale: fr }
                        )}{" "}
                        au{" "}
                        {format(
                          new Date(request.endDate),
                          "dd MMMM yyyy",
                          { locale: fr }
                        )}
                      </p>

                      {request.reason && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Motif: {request.reason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {request.duration} jours
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Créé le{" "}
                        {format(
                          new Date(request.createdAt),
                          "dd/MM/yyyy",
                          { locale: fr }
                        )}
                      </p>
                    </div>

                    <span className={getStatusBadgeClass(request.status)}>
                      {STATUS_LABELS[request.status]}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {exceptionalRequests.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-2xl font-bold">
                {exceptionalRequests.length}
              </p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>

            <div className="rounded-lg bg-warning/10 p-4 text-center">
              <p className="text-2xl font-bold">
                {
                  exceptionalRequests.filter((r) =>
                    r.status.startsWith("pending")
                  ).length
                }
              </p>
              <p className="text-sm text-muted-foreground">
                En attente
              </p>
            </div>

            <div className="rounded-lg bg-success/10 p-4 text-center">
              <p className="text-2xl font-bold">
                {
                  exceptionalRequests.filter(
                    (r) => r.status === "approved"
                  ).length
                }
              </p>
              <p className="text-sm text-muted-foreground">
                Approuvées
              </p>
            </div>

          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Absences;