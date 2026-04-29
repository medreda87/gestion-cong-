import { useState } from "react";
import { User, Building2, Mail, FileText, Hash, Calendar, Eye, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DashboardLayout } from "../../components/layout/DashboardLayout";

export default function Settings() {
  // État des paramètres
  const [params, setParams] = useState({
    nomDirecteur: "Mohammed El Alaoui",
    fonction: "Directeur des Ressources Humaines",
    email: "m.elalaoui@example.gov.ma",
    refDocument: "REF-2024-001",
    numDecision: "DEC-2024-0156",
    dateDecision: "2024-12-20",
  });

  const [reviewOpen, setReviewOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
    if (saved) setSaved(false);
  };

  const handleSave = () => {
    console.log("Paramètres enregistrés :", params);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    // Ici, appel API ou persistence
  };

  const isFormValid = () => {
    return params.nomDirecteur.trim() !== "" && params.refDocument.trim() !== "";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* En-tête de page améliorée */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Paramètres de la direction</h1>
          <p className="mt-2 text-gray-600">
            Gérez les informations du signataire et les références des décisions officielles
          </p>
        </div>

        {/* Alerte de confirmation */}
        {saved && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Paramètres mis à jour avec succès.
            </AlertDescription>
          </Alert>
        )}

        {/* Carte 1 : Informations du signataire */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-blue-600" />
              Informations du signataire
            </CardTitle>
            <CardDescription>
              Identité et coordonnées du directeur qui signera les documents
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomDirecteur" className="text-sm font-medium">
                  Nom complet <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nomDirecteur"
                  name="nomDirecteur"
                  value={params.nomDirecteur}
                  onChange={handleChange}
                  placeholder="Prénom et Nom"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fonction" className="text-sm font-medium">
                  Fonction / Titre
                </Label>
                <Input
                  id="fonction"
                  name="fonction"
                  value={params.fonction}
                  onChange={handleChange}
                  placeholder="Ex: Directeur Général"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Adresse email professionnelle
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={params.email}
                  onChange={handleChange}
                  placeholder="directeur@ministere.ma"
                  className="bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carte 2 : Références de la décision */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              Références de la décision
            </CardTitle>
            <CardDescription>
              Numéros, dates et identifiants utilisés dans les documents officiels
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="refDocument" className="text-sm font-medium">
                  Référence du document <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="refDocument"
                  name="refDocument"
                  value={params.refDocument}
                  onChange={handleChange}
                  placeholder="REF-2025-0001"
                  className="bg-white font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numDecision" className="text-sm font-medium">
                  Numéro de décision
                </Label>
                <Input
                  id="numDecision"
                  name="numDecision"
                  value={params.numDecision}
                  onChange={handleChange}
                  placeholder="DÉC-2024-089"
                  className="bg-white font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateDecision" className="text-sm font-medium">
                  Date de décision
                </Label>
                <Input
                  id="dateDecision"
                  name="dateDecision"
                  type="date"
                  value={params.dateDecision}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-2">
          <Button
            variant="outline"
            onClick={() => setReviewOpen(true)}
            className="border-gray-300 hover:bg-gray-50"
          >
            <Eye className="mr-2 h-4 w-4" />
            Réviser
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid()}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Save className="mr-2 h-4 w-4" />
            Enregistrer les paramètres
          </Button>
        </div>

        {/* Modale de révision */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Récapitulatif</DialogTitle>
              <DialogDescription>
                Vérifiez attentivement toutes les informations avant validation.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-3 gap-2 text-sm items-start">
                <span className="font-semibold text-gray-700">Nom directeur :</span>
                <span className="col-span-2 text-gray-900">{params.nomDirecteur || "—"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm items-start">
                <span className="font-semibold text-gray-700">Fonction :</span>
                <span className="col-span-2 text-gray-900">{params.fonction || "—"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm items-start">
                <span className="font-semibold text-gray-700">Email :</span>
                <span className="col-span-2 text-gray-900 break-all">{params.email || "—"}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-3 gap-2 text-sm items-start">
                <span className="font-semibold text-gray-700">Réf. document :</span>
                <span className="col-span-2 font-mono text-gray-900">{params.refDocument || "—"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm items-start">
                <span className="font-semibold text-gray-700">N° décision :</span>
                <span className="col-span-2 font-mono text-gray-900">{params.numDecision || "—"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm items-start">
                <span className="font-semibold text-gray-700">Date décision :</span>
                <span className="col-span-2 text-gray-900">
                  {params.dateDecision
                    ? new Date(params.dateDecision).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setReviewOpen(false)}>
                Retour
              </Button>
              <Button
                onClick={() => {
                  setReviewOpen(false);
                  handleSave();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Confirmer et enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}