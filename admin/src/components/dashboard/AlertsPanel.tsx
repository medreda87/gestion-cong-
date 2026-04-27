import { AlertTriangle, Clock, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "warning" | "info" | "urgent";
  title: string;
  description: string;
  icon: typeof AlertTriangle;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "urgent",
    title: "3 demandes en attente",
    description: "Depuis plus de 48 heures",
    icon: Clock,
  },
  {
    id: "2",
    type: "warning",
    title: "Chevauchement détecté",
    description: "Service Comptabilité - 15-20 Janvier",
    icon: AlertTriangle,
  },
  {
    id: "3",
    type: "info",
    title: "Effectif réduit",
    description: "Service RH à 50% la semaine prochaine",
    icon: Users,
  },
  {
    id: "4",
    type: "info",
    title: "Jour férié proche",
    description: "Fête nationale dans 5 jours",
    icon: Calendar,
  },
];

const alertStyles = {
  urgent: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  info: "border-l-info bg-info/5",
};

const iconStyles = {
  urgent: "text-destructive",
  warning: "text-warning",
  info: "text-info",
};

export function AlertsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Alertes et notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border-l-4 p-3 transition-all hover:shadow-sm",
              alertStyles[alert.type]
            )}
          >
            <alert.icon className={cn("h-5 w-5 mt-0.5", iconStyles[alert.type])} />
            <div>
              <p className="font-medium text-foreground">{alert.title}</p>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
