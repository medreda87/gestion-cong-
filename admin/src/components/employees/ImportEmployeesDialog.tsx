import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface ImportedEmployee {
  id: string;
  name: string;
  department: string;
  position: string;
  annualBalance: number;
  sickBalance: number;
  status: "active" | "inactive";
  isValid: boolean;
  errors: string[];
}

interface ImportEmployeesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (employees: ImportedEmployee[]) => void;
}

const REQUIRED_COLUMNS = ["matricule", "nom", "département", "poste"];

export function ImportEmployeesDialog({
  open,
  onOpenChange,
  onImport,
}: ImportEmployeesDialogProps) {
  const [importedData, setImportedData] = useState<ImportedEmployee[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setImportedData([]);
    setFileName("");
    setParseError("");
    setIsLoading(false);
  };

  const validateEmployee = (row: Record<string, unknown>, index: number): ImportedEmployee => {
    const errors: string[] = [];

    const id = String(row["matricule"] || row["Matricule"] || row["ID"] || "").trim();
    const name = String(row["nom"] || row["Nom"] || row["name"] || "").trim();
    const department = String(row["département"] || row["Département"] || row["department"] || "").trim();
    const position = String(row["poste"] || row["Poste"] || row["position"] || "").trim();
    const annualBalance = Number(row["congés_annuels"] || row["Congés annuels"] || row["annual_balance"] || 22);
    const sickBalance = Number(row["congés_maladie"] || row["Congés maladie"] || row["sick_balance"] || 15);
    const statusRaw = String(row["statut"] || row["Statut"] || row["status"] || "actif").toLowerCase();

    if (!id) errors.push("Matricule manquant");
    if (!name) errors.push("Nom manquant");
    if (!department) errors.push("Département manquant");
    if (!position) errors.push("Poste manquant");
    if (isNaN(annualBalance) || annualBalance < 0) errors.push("Solde congés annuels invalide");
    if (isNaN(sickBalance) || sickBalance < 0) errors.push("Solde congés maladie invalide");

    const status: "active" | "inactive" = statusRaw === "inactif" || statusRaw === "inactive" ? "inactive" : "active";

    return {
      id: id || `TEMP-${index}`,
      name,
      department,
      position,
      annualBalance: isNaN(annualBalance) ? 22 : annualBalance,
      sickBalance: isNaN(sickBalance) ? 15 : sickBalance,
      status,
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setParseError("");
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

      if (jsonData.length === 0) {
        setParseError("Le fichier est vide ou le format n'est pas reconnu.");
        setIsLoading(false);
        return;
      }

      const employees = jsonData.map((row, index) => validateEmployee(row, index));
      setImportedData(employees);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      setParseError("Erreur lors de la lecture du fichier. Vérifiez le format.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    const validEmployees = importedData.filter((e) => e.isValid);
    if (validEmployees.length === 0) {
      toast({
        title: "Aucun employé valide",
        description: "Corrigez les erreurs dans le fichier et réessayez.",
        variant: "destructive",
      });
      return;
    }

    onImport(validEmployees);
    toast({
      title: "Import réussi",
      description: `${validEmployees.length} employé(s) importé(s) avec succès.`,
    });
    resetState();
    onOpenChange(false);
  };

  const validCount = importedData.filter((e) => e.isValid).length;
  const invalidCount = importedData.filter((e) => !e.isValid).length;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetState();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Importer des employés
          </DialogTitle>
          <DialogDescription>
            Importez une liste d'employés depuis un fichier Excel (.xlsx, .xls)
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Upload Zone */}
          {importedData.length === 0 && (
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Glissez-déposez votre fichier Excel ici ou cliquez pour sélectionner
                </p>
                <Button variant="secondary" size="sm" disabled={isLoading}>
                  {isLoading ? "Chargement..." : "Sélectionner un fichier"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {parseError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Format attendu :</strong> Le fichier doit contenir les colonnes suivantes :
                  <br />
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                    matricule, nom, département, poste, congés_annuels, congés_maladie, statut
                  </code>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Preview Data */}
          {importedData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{fileName}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={resetState}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    {validCount} valide(s)
                  </span>
                  {invalidCount > 0 && (
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      {invalidCount} erreur(s)
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-lg border overflow-auto max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">État</TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>C. Annuels</TableHead>
                      <TableHead>C. Maladie</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedData.map((employee, index) => (
                      <TableRow
                        key={index}
                        className={!employee.isValid ? "bg-destructive/5" : ""}
                      >
                        <TableCell>
                          {employee.isValid ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {employee.id}
                        </TableCell>
                        <TableCell>{employee.name || "-"}</TableCell>
                        <TableCell>{employee.department || "-"}</TableCell>
                        <TableCell>{employee.position || "-"}</TableCell>
                        <TableCell>{employee.annualBalance}</TableCell>
                        <TableCell>{employee.sickBalance}</TableCell>
                        <TableCell>
                          <Badge
                            variant={employee.status === "active" ? "default" : "secondary"}
                          >
                            {employee.status === "active" ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {invalidCount > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {invalidCount} ligne(s) contiennent des erreurs et ne seront pas importées.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        {importedData.length > 0 && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              resetState();
              onOpenChange(false);
            }}>
              Annuler
            </Button>
            <Button onClick={handleConfirmImport} disabled={validCount === 0}>
              Importer {validCount} employé(s)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
