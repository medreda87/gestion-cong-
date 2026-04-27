import { useState } from "react";
import { Search, Filter, Download, Eye, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  submittedDate: string;
}

const leaveRequests: LeaveRequest[] = [
  { id: "REQ-001", employeeName: "Ahmed Benali", department: "Comptabilité", type: "Congé annuel", startDate: "15/01/2024", endDate: "22/01/2024", days: 6, status: "pending", submittedDate: "10/01/2024" },
  { id: "REQ-002", employeeName: "Fatima Zahra", department: "Ressources Humaines", type: "Congé maladie", startDate: "18/01/2024", endDate: "20/01/2024", days: 3, status: "pending", submittedDate: "17/01/2024" },
  { id: "REQ-003", employeeName: "Mohamed Alami", department: "Informatique", type: "Congé exceptionnel", startDate: "25/01/2024", endDate: "26/01/2024", days: 2, status: "pending", submittedDate: "20/01/2024" },
  { id: "REQ-004", employeeName: "Khadija Elhami", department: "Finance", type: "Congé annuel", startDate: "01/02/2024", endDate: "10/02/2024", days: 8, status: "approved", submittedDate: "15/01/2024" },
  { id: "REQ-005", employeeName: "Youssef Mansouri", department: "Marketing", type: "Congé maladie", startDate: "05/01/2024", endDate: "07/01/2024", days: 3, status: "approved", submittedDate: "04/01/2024" },
  { id: "REQ-006", employeeName: "Amina Benjelloun", department: "Juridique", type: "Congé maternité", startDate: "01/03/2024", endDate: "01/06/2024", days: 90, status: "approved", submittedDate: "01/01/2024" },
  { id: "REQ-007", employeeName: "Hassan Tazi", department: "Comptabilité", type: "Congé annuel", startDate: "12/01/2024", endDate: "15/01/2024", days: 4, status: "rejected", submittedDate: "05/01/2024" },
  { id: "REQ-008", employeeName: "Sara Idrissi", department: "Informatique", type: "Congé annuel", startDate: "20/02/2024", endDate: "28/02/2024", days: 7, status: "pending", submittedDate: "01/02/2024" },
];

export default function LeaveRequests() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredRequests = leaveRequests.filter((request) => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Demandes de congé</h1>
        <p className="page-subtitle">
          Gérez et validez les demandes de congé des employés
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvé</SelectItem>
              <SelectItem value="rejected">Refusé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type de congé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="Congé annuel">Congé annuel</SelectItem>
              <SelectItem value="Congé maladie">Congé maladie</SelectItem>
              <SelectItem value="Congé exceptionnel">Congé exceptionnel</SelectItem>
              <SelectItem value="Congé maternité">Congé maternité</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Employé</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Soumis le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{request.id}</TableCell>
                <TableCell>{request.employeeName}</TableCell>
                <TableCell>{request.department}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  {request.startDate} → {request.endDate}
                </TableCell>
                <TableCell>{request.days} jours</TableCell>
                <TableCell>
                  <StatusBadge status={request.status} />
                </TableCell>
                <TableCell>{request.submittedDate}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => navigate(`/leave-requests/${request.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
