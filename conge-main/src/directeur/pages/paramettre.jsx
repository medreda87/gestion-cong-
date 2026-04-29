import { Building2, User, FileText, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Paramètres</h1>
        <p className="page-subtitle">
          Configurez les paramètres de l'application
        </p>
      </div>

      <div className="grid gap-6">
        {/* Director Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations du directeur
            </CardTitle>
            <CardDescription>
              Signataire des décisions de congé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="director-name">Nom complet</Label>
                <Input id="director-name" defaultValue="Mohammed El Alaoui" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="director-title">Titre / Fonction</Label>
                <Input id="director-title" defaultValue="Directeur des Ressources Humaines" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="director-email">Email</Label>
              <Input id="director-email" type="email" defaultValue="m.elalaoui@mef.gov.ma" />
            </div>
          </CardContent>
        </Card>

        {/* Document Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Paramètres des documents
            </CardTitle>
            <CardDescription>
              Configuration des décisions et documents générés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="decision-prefix">Préfixe de décision</Label>
                <Input id="decision-prefix" defaultValue="DEC-RH" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="decision-year">Année en cours</Label>
                <Input id="decision-year" defaultValue="2024" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="decision-counter">Numéro de la prochaine décision</Label>
              <Input id="decision-counter" type="number" defaultValue="156" />
            </div>
            <Separator />
          </CardContent>
        </Card>

      
      </div>
    </div>
    </DashboardLayout>
  );
}
