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

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Paramètres</h1>
        <p className="page-subtitle">
          Configurez les paramètres de l'application
        </p>
      </div>

      <div className="grid gap-6">
        {/* Organization Info */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Informations de l'organisation
            </CardTitle>
            <CardDescription>
              Ces informations apparaîtront sur les documents officiels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="org-name">Nom de l'organisation</Label>
                <Input 
                  id="org-name" 
                  defaultValue="Ministère de l'Économie et des Finances"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-short">Acronyme / Nom court</Label>
                <Input id="org-short" defaultValue="MEF" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea 
                id="address" 
                defaultValue="Boulevard Mohammed V, Quartier Administratif, Rabat"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+212 5 37 67 75 00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="contact@mef.gov.ma" />
              </div>
            </div>
          </CardContent>
        </Card> */}

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
            {/* <div className="space-y-2">
              <Label htmlFor="header-text">En-tête des documents</Label>
              <Textarea 
                id="header-text" 
                rows={3}
                defaultValue="ROYAUME DU MAROC
Ministère de l'Économie et des Finances
Direction des Ressources Humaines"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footer-text">Pied de page des documents</Label>
              <Textarea 
                id="footer-text" 
                rows={2}
                defaultValue="Boulevard Mohammed V, Quartier Administratif, Rabat - Tél: +212 5 37 67 75 00"
              />
            </div> */}
          </CardContent>
        </Card>

        {/* Leave Policy */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Politique de congés
            </CardTitle>
            <CardDescription>
              Règles et paramètres par défaut pour les congés
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="annual-days">Congés annuels (jours)</Label>
                <Input id="annual-days" type="number" defaultValue="22" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sick-days">Congés maladie (jours)</Label>
                <Input id="sick-days" type="number" defaultValue="15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-consecutive">Max. jours consécutifs</Label>
                <Input id="max-consecutive" type="number" defaultValue="15" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notice-days">Délai de préavis minimum (jours)</Label>
              <Input id="notice-days" type="number" defaultValue="3" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Exiger un remplaçant</Label>
                <p className="text-sm text-muted-foreground">
                  Le demandeur doit désigner un remplaçant
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Report des congés non utilisés</Label>
                <p className="text-sm text-muted-foreground">
                  Autoriser le report à l'année suivante
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card> */}

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez les alertes et notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notification par email</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir les demandes par email
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rappel des demandes en attente</Label>
                <p className="text-sm text-muted-foreground">
                  Rappel quotidien des demandes non traitées
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alerte de chevauchement</Label>
                <p className="text-sm text-muted-foreground">
                  Avertir en cas de chevauchement de congés
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg">
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}
