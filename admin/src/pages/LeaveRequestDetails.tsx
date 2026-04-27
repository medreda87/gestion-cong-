import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Calendar, Clock, FileText, UserCheck, Printer, CheckCircle2, XCircle, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { downloadDecisionPDF, previewDecisionPDF, generateDecisionNumber, type DecisionData } from "@/lib/pdf-generator";
import { toast } from "@/hooks/use-toast";

// Organization settings (would come from Settings/Context in real app)
const organizationSettings = {
  name: "Ministère de l'Économie et des Finances",
  address: "Boulevard Mohammed V, Quartier Administratif, Rabat",
  headerText: "ROYAUME DU MAROC\nMinistère de l'Économie et des Finances\nDirection des Ressources Humaines",
  footerText: "Boulevard Mohammed V, Quartier Administratif, Rabat - Tél: +212 5 37 67 75 00",
  director: {
    name: "Mohammed El Alaoui",
    title: "Directeur des Ressources Humaines",
  },
  decisionCounter: {
    prefix: "DEC-RH",
    year: 2024,
    counter: 156,
  },
};

const requestDetails = {
  id: "REQ-001",
  status: "approved" as "pending" | "approved" | "rejected",
  decisionNumber: generateDecisionNumber(organizationSettings.decisionCounter),
  decisionDate: "12/01/2024",
  employee: {
    name: "Ahmed Benali",
    id: "EMP-0045",
    department: "Comptabilité",
    position: "Chef de service",
    email: "a.benali@administration.gov.ma",
    phone: "+212 6 12 34 56 78",
  },
  leave: {
    type: "Congé annuel",
    startDate: "15/01/2024",
    endDate: "22/01/2024",
    days: 6,
    reason: "Congé familial - vacances avec la famille",
  },
  substitute: {
    name: "Karim Tazi",
    position: "Adjoint au chef de service",
    confirmed: true,
  },
  balance: {
    before: 18,
    after: 12,
    total: 22,
  },
  timeline: {
    submitted: "10/01/2024 à 09:30",
    approved: "12/01/2024 à 14:15",
    lastModified: null,
  },
};

export default function LeaveRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/leave-requests")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title mb-0">Demande {id || requestDetails.id}</h1>
              <StatusBadge status={requestDetails.status} />
            </div>
            <p className="page-subtitle">Détails de la demande de congé</p>
          </div>
        </div>
        <div className="flex gap-2">
          {requestDetails.status === "approved" && (
            <>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  const decisionData: DecisionData = {
                    decisionNumber: requestDetails.decisionNumber,
                    decisionDate: requestDetails.decisionDate,
                    employee: requestDetails.employee,
                    leave: requestDetails.leave,
                    substitute: requestDetails.substitute,
                    organization: {
                      name: organizationSettings.name,
                      address: organizationSettings.address,
                      headerText: organizationSettings.headerText,
                      footerText: organizationSettings.footerText,
                    },
                    director: organizationSettings.director,
                  };
                  previewDecisionPDF(decisionData);
                }}
              >
                <Eye className="h-4 w-4" />
                Aperçu décision
              </Button>
              <Button 
                className="gap-2"
                onClick={() => {
                  const decisionData: DecisionData = {
                    decisionNumber: requestDetails.decisionNumber,
                    decisionDate: requestDetails.decisionDate,
                    employee: requestDetails.employee,
                    leave: requestDetails.leave,
                    substitute: requestDetails.substitute,
                    organization: {
                      name: organizationSettings.name,
                      address: organizationSettings.address,
                      headerText: organizationSettings.headerText,
                      footerText: organizationSettings.footerText,
                    },
                    director: organizationSettings.director,
                  };
                  downloadDecisionPDF(decisionData);
                  toast({
                    title: "Décision téléchargée",
                    description: `Décision N° ${requestDetails.decisionNumber} téléchargée avec succès.`,
                  });
                }}
              >
                <Download className="h-4 w-4" />
                Télécharger PDF
              </Button>
            </>
          )}
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Informations de l'employé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">{requestDetails.employee.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Matricule</p>
                  <p className="font-medium">{requestDetails.employee.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p className="font-medium">{requestDetails.employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Poste</p>
                  <p className="font-medium">{requestDetails.employee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{requestDetails.employee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{requestDetails.employee.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Détails du congé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Type de congé</p>
                  <p className="font-medium">{requestDetails.leave.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="font-medium">{requestDetails.leave.days} jours ouvrables</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de début</p>
                  <p className="font-medium">{requestDetails.leave.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de fin</p>
                  <p className="font-medium">{requestDetails.leave.endDate}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Motif / Justification</p>
                <p className="font-medium">{requestDetails.leave.reason}</p>
              </div>
            </CardContent>
          </Card>

          {/* Substitute */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserCheck className="h-5 w-5 text-primary" />
                Remplaçant désigné
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{requestDetails.substitute.name}</p>
                  <p className="text-sm text-muted-foreground">{requestDetails.substitute.position}</p>
                </div>
                {requestDetails.substitute.confirmed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmé
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation Actions */}
          {requestDetails.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions de validation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="comment">Commentaire (optionnel)</Label>
                  <Textarea
                    id="comment"
                    placeholder="Ajouter un commentaire..."
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2 bg-success hover:bg-success/90">
                    <CheckCircle2 className="h-4 w-4" />
                    Approuver la demande
                  </Button>
                  <Button variant="destructive" className="gap-2">
                    <XCircle className="h-4 w-4" />
                    Refuser la demande
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Solde de congés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solde total annuel</span>
                <span className="font-medium">{requestDetails.balance.total} jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solde actuel</span>
                <span className="font-medium">{requestDetails.balance.before} jours</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solde après approbation</span>
                <span className="font-bold text-primary">{requestDetails.balance.after} jours</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(requestDetails.balance.after / requestDetails.balance.total) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Historique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">Demande soumise</p>
                    <p className="text-xs text-muted-foreground">{requestDetails.timeline.submitted}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-warning" />
                  <div>
                    <p className="text-sm font-medium">En attente de validation</p>
                    <p className="text-xs text-muted-foreground">Directeur</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                Référence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Numéro de demande</p>
              <p className="font-mono font-medium">{requestDetails.id}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
