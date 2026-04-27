import { Clock, CheckCircle2, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PendingRequest {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
}

const pendingRequests: PendingRequest[] = [
  {
    id: "REQ-001",
    employeeName: "Ahmed Benali",
    department: "Comptabilité",
    type: "Congé annuel",
    startDate: "15/01/2024",
    endDate: "22/01/2024",
    days: 6,
  },
  {
    id: "REQ-002",
    employeeName: "Fatima Zahra",
    department: "Ressources Humaines",
    type: "Congé maladie",
    startDate: "18/01/2024",
    endDate: "20/01/2024",
    days: 3,
  },
  {
    id: "REQ-003",
    employeeName: "Mohamed Alami",
    department: "Informatique",
    type: "Congé exceptionnel",
    startDate: "25/01/2024",
    endDate: "26/01/2024",
    days: 2,
  },
];

export function PendingRequests() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-warning" />
          Demandes en attente
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate("/leave-requests")}>
          Voir tout
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{request.employeeName}</p>
                  <Badge variant="secondary" className="text-xs">
                    {request.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{request.department}</p>
                <p className="text-sm text-muted-foreground">
                  {request.startDate} → {request.endDate} ({request.days} jours)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigate(`/leave-requests/${request.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
