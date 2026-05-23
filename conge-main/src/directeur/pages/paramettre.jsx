import { useState, useEffect } from "react";
import { User, FileText, Eye, Save, CheckCircle, Trash2, Plus, Loader2 } from "lucide-react";
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
import { useData } from "@/contexts/DataContext";
import { toast } from "sonner";

export default function Settings() {
  const { getParametrage, addParametrage, updateParametrage, deleteParametrage,parameters } = useData();

  const [parametrage, setParametrage] = useState(null); // null = ماكاينش
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [params, setParams] = useState({
    cfpt_code: "",
    direction_code: "",
    delegation_number: "",
    delegation_date: "",
  });

  
 useEffect(() => {
    if (parameters) {
        setParametrage(parameters);
        setParams({
            cfpt_code: parameters.cfpt_code || "",
            direction_code: parameters.direction_code || "",
            delegation_number: parameters.delegation_number || "",
            delegation_date: parameters.delegation_date?.split("T")[0] || "",
        });
    }
    setLoading(false);
}, [parameters]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ SAVE — ADD أو UPDATE حسب واش كاين parametrage
  const handleSave = async () => {
  setSaving(true);
  try {
    if (parametrage) {
      // UPDATE
      const res = await updateParametrage(parametrage.id, params);
      setParametrage(res.data || res); // ← زيد || res
      toast.success("Paramétrage mis à jour avec succès");
    } else {
      // ADD
      const res = await addParametrage(params);
      setParametrage(res.data || res); // ← زيد || res
      toast.success("Paramétrage créé avec succès");
    }
    setReviewOpen(false);
  } catch (error) {
    toast.error("Erreur lors de l'enregistrement");
    console.log(error);
  } finally {
    setSaving(false);
  }
};

  // ✅ DELETE
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteParametrage(parametrage.id);
      setParametrage(null);
      setParams({
        cfpt_code: "",
        direction_code: "",
        delegation_number: "",
        delegation_date: "",
      });
      setDeleteOpen(false);
      toast.success("Paramétrage supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  const isFormValid = () =>
    params.cfpt_code.trim() !== "" &&
    params.direction_code.trim() !== "" &&
    params.delegation_number.trim() !== "" &&
    params.delegation_date !== "";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Paramètres de la direction
            </h1>
            <p className="mt-2 text-gray-600">
              Gérez les informations du signataire et les références des décisions officielles
            </p>
          </div>
          {/* badge: كاين ولا لا */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            parametrage
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {parametrage ? "Configuré" : "Non configuré"}
          </span>
        </div>

        {/* Alert إلا ماكاينش parametrage */}
        {!parametrage && (
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <Plus className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              Aucun paramétrage trouvé. Remplissez le formulaire pour en créer un.
            </AlertDescription>
          </Alert>
        )}

        {/* Carte: Références */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="bg-gray-50/50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              Références de la direction
            </CardTitle>
            <CardDescription>
              Informations utilisées dans les documents officiels
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cfpt_code" className="text-sm font-medium">
                  Code CFPT <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cfpt_code"
                  name="cfpt_code"
                  value={params.cfpt_code}
                  onChange={handleChange}
                  placeholder="Ex: CFPT-001"
                  className="bg-white font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direction_code" className="text-sm font-medium">
                  Code Direction <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="direction_code"
                  name="direction_code"
                  value={params.direction_code}
                  onChange={handleChange}
                  placeholder="Ex: DIR-2024"
                  className="bg-white font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delegation_number" className="text-sm font-medium">
                  Numéro de délégation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="delegation_number"
                  name="delegation_number"
                  value={params.delegation_number}
                  onChange={handleChange}
                  placeholder="Ex: DÉL-2024-089"
                  className="bg-white font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delegation_date" className="text-sm font-medium">
                  Date de délégation <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="delegation_date"
                  name="delegation_date"
                  type="date"
                  value={params.delegation_date}
                  onChange={handleChange}
                  className="bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          {/* DELETE — تبان غير إلا كاين parametrage */}
          {parametrage && (
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(true)}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}

          <div className="flex gap-4 ml-auto">
            <Button
              variant="outline"
              onClick={() => setReviewOpen(true)}
              disabled={!isFormValid()}
              className="border-gray-300 hover:bg-gray-50"
            >
              <Eye className="mr-2 h-4 w-4" />
              Réviser
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid() || saving}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : parametrage ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {saving ? "Enregistrement..." : parametrage ? "Mettre à jour" : "Créer le paramétrage"}
            </Button>
          </div>
        </div>

        {/* Modal Révision */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">Récapitulatif</DialogTitle>
              <DialogDescription>
                Vérifiez les informations avant validation.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="grid gap-4 py-2">
              {[
                { label: "Code CFPT", value: params.cfpt_code },
                { label: "Code Direction", value: params.direction_code },
                { label: "N° Délégation", value: params.delegation_number },
                {
                  label: "Date Délégation",
                  value: params.delegation_date
                    ? new Date(params.delegation_date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—",
                },
              ].map(({ label, value }) => (
                <div key={label} className="grid grid-cols-3 gap-2 text-sm items-start">
                  <span className="font-semibold text-gray-700">{label} :</span>
                  <span className="col-span-2 font-mono text-gray-900">{value || "—"}</span>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setReviewOpen(false)}>
                Retour
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Confirmer et enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Delete */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-red-600">Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Voulez-vous vraiment supprimer ce paramétrage ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                {deleting ? "Suppression..." : "Supprimer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}