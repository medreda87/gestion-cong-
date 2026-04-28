import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Filter, Calendar, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useLeave } from "@/contexts/LeaveContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Absences = () => {
  const { user } = useAuth();
  const { requests = [], updateRequestStatus } = useLeave();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) return null;

  const STATUS_LABELS = {
    pending_manager:
      user.role === "manager"
        ? "En attente (Directeur)"
        : "En attente (Responsable)",
    pending_director: "En attente (Directeur)",
    approved: "Approuvé",
    rejected: "Refusé",
    cancelled: "Annulée",
  };

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
      cancelled:
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-gray-200 text-gray-700 border-gray-300",
    };

    return (
      variants[status] ||
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
    );
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
                Suivi des demandes d’absence exceptionnelle
              </p>
            </div>
          </div>

          <Link to="/request">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
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
                placeholder="Rechercher par motif ou employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-9 py-2 text-sm"
              />
            </div>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-[200px] rounded-md border border-input bg-background px-8 py-2 text-sm"
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
          transition={{ delay: 0.1 }}
          className="rounded-xl border bg-card shadow-sm"
        >
          {filteredRequests.length === 0 ? (
            <div className="py-16 text-center">
              <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-muted-foreground/30" />

              <h3 className="text-lg font-medium">
                Aucune absence exceptionnelle trouvée
              </h3>

              <p className="mt-2 text-muted-foreground">
                Aucune demande ne correspond à vos critères
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
                          : request.status === "cancelled"
                          ? "bg-gray-100"
                          : "bg-warning/10"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          request.status === "approved"
                            ? "text-success"
                            : request.status === "rejected"
                            ? "text-destructive"
                            : request.status === "cancelled"
                            ? "text-gray-600"
                            : "text-warning"
                        }`}
                      />
                    </div>

                    <div>
                      <p className="font-medium">
                        Absence exceptionnelle
                      </p>

                      {request.employeeName && (
                        <p className="text-xs text-muted-foreground">
                          Employé: {request.employeeName}
                        </p>
                      )}

                      <p className="text-sm text-muted-foreground">
                        Du{" "}
                        {format(new Date(request.startDate), "dd MMMM", {
                          locale: fr,
                        })}{" "}
                        au{" "}
                        {format(new Date(request.endDate), "dd MMMM yyyy", {
                          locale: fr,
                        })}
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
                      <p className="text-lg font-semibold">
                        {request.duration} jours
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Créé le{" "}
                        {format(new Date(request.createdAt), "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>

                    <span className={getStatusBadgeClass(request.status)}>
                      {STATUS_LABELS[request.status]}
                    </span>

                    {request.status === "pending_manager" && (
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Voulez-vous vraiment annuler cette absence ?"
                            )
                          ) {
                            updateRequestStatus(request.id, "cancelled");
                          }
                        }}
                    className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-300"
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
        {exceptionalRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {[
              {
                label: "Total absences",
                count: exceptionalRequests.length,
                color: "from-slate-500 to-slate-700",
                bg: "bg-slate-50",
              },
              {
                label: "En attente",
                count: exceptionalRequests.filter((r) =>
                  r.status.startsWith("pending")
                ).length,
                color: "from-amber-500 to-orange-500",
                bg: "bg-amber-50",
              },
              {
                label: "Approuvées",
                count: exceptionalRequests.filter(
                  (r) => r.status === "approved"
                ).length,
                color: "from-emerald-500 to-green-500",
                bg: "bg-emerald-50",
              },
              {
                label: "Annulées",
                count: exceptionalRequests.filter(
                  (r) => r.status === "cancelled"
                ).length,
                color: "from-rose-500 to-red-500",
                bg: "bg-rose-50",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${stat.color}`}
                />

                <div
                  className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg}`}
                >
                  <span className="text-xl font-bold text-gray-900">
                    {stat.count}
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-700">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Absences;