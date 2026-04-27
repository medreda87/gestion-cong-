import { useState } from "react";
import { Search, Users, Eye, History, BarChart3, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImportEmployeesDialog } from "@/components/employees/ImportEmployeesDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  annualBalance: number;
  annualUsed: number;
  sickBalance: number;
  sickUsed: number;
  status: "active" | "inactive";
}

const employees: Employee[] = [
  { id: "EMP-0045", name: "Ahmed Benali", department: "Comptabilité", position: "Chef de service", annualBalance: 22, annualUsed: 4, sickBalance: 15, sickUsed: 2, status: "active" },
  { id: "EMP-0032", name: "Fatima Zahra", department: "Ressources Humaines", position: "Responsable RH", annualBalance: 22, annualUsed: 8, sickBalance: 15, sickUsed: 5, status: "active" },
  { id: "EMP-0078", name: "Mohamed Alami", department: "Informatique", position: "Développeur Senior", annualBalance: 22, annualUsed: 12, sickBalance: 15, sickUsed: 0, status: "active" },
  { id: "EMP-0056", name: "Khadija Elhami", department: "Finance", position: "Analyste financier", annualBalance: 22, annualUsed: 6, sickBalance: 15, sickUsed: 3, status: "active" },
  { id: "EMP-0023", name: "Youssef Mansouri", department: "Marketing", position: "Chef de projet", annualBalance: 22, annualUsed: 15, sickBalance: 15, sickUsed: 1, status: "active" },
  { id: "EMP-0089", name: "Amina Benjelloun", department: "Juridique", position: "Juriste", annualBalance: 22, annualUsed: 0, sickBalance: 15, sickUsed: 0, status: "inactive" },
  { id: "EMP-0067", name: "Hassan Tazi", department: "Comptabilité", position: "Comptable", annualBalance: 22, annualUsed: 10, sickBalance: 15, sickUsed: 4, status: "active" },
  { id: "EMP-0091", name: "Sara Idrissi", department: "Informatique", position: "Analyste", annualBalance: 22, annualUsed: 5, sickBalance: 15, sickUsed: 2, status: "active" },
];

const leaveHistory = [
  { id: "REQ-001", type: "Congé annuel", startDate: "15/01/2024", endDate: "22/01/2024", days: 6, status: "approved" },
  { id: "REQ-015", type: "Congé maladie", startDate: "05/12/2023", endDate: "07/12/2023", days: 3, status: "approved" },
  { id: "REQ-032", type: "Congé annuel", startDate: "01/08/2023", endDate: "15/08/2023", days: 11, status: "approved" },
  { id: "REQ-045", type: "Congé exceptionnel", startDate: "10/06/2023", endDate: "11/06/2023", days: 2, status: "approved" },
];

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeesList, setEmployeesList] = useState<Employee[]>(employees);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleImportEmployees = (importedEmployees: { id: string; name: string; department: string; position: string; annualBalance: number; sickBalance: number; status: "active" | "inactive" }[]) => {
    const newEmployees: Employee[] = importedEmployees.map((emp) => ({
      ...emp,
      annualUsed: 0,
      sickUsed: 0,
    }));
    setEmployeesList((prev) => [...prev, ...newEmployees]);
  };
  const filteredEmployees = employeesList.filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const departments = [...new Set(employeesList.map(e => e.department))];

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Gestion des employés</h1>
        <p className="page-subtitle">
          Consultez les informations et soldes de congés des employés
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsImportDialogOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Importer Excel
        </Button>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Matricule</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Département</TableHead>
              <TableHead>Poste</TableHead>
              <TableHead>Congés annuels</TableHead>
              <TableHead>Congés maladie</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-mono text-sm">{employee.id}</TableCell>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={((employee.annualBalance - employee.annualUsed) / employee.annualBalance) * 100} 
                      className="h-2 w-16"
                    />
                    <span className="text-sm text-muted-foreground">
                      {employee.annualBalance - employee.annualUsed}/{employee.annualBalance}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={((employee.sickBalance - employee.sickUsed) / employee.sickBalance) * 100} 
                      className="h-2 w-16"
                    />
                    <span className="text-sm text-muted-foreground">
                      {employee.sickBalance - employee.sickUsed}/{employee.sickBalance}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={employee.status === "active" ? "default" : "secondary"}>
                    {employee.status === "active" ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Employee Detail Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {selectedEmployee?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <Tabs defaultValue="balance" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="balance" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Soldes
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="h-4 w-4" />
                  Historique
                </TabsTrigger>
              </TabsList>

              <TabsContent value="balance" className="mt-4 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Congés annuels
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedEmployee.annualBalance - selectedEmployee.annualUsed} jours
                      </div>
                      <Progress 
                        value={((selectedEmployee.annualBalance - selectedEmployee.annualUsed) / selectedEmployee.annualBalance) * 100}
                        className="mt-2 h-2"
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selectedEmployee.annualUsed} utilisés sur {selectedEmployee.annualBalance}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Congés maladie
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {selectedEmployee.sickBalance - selectedEmployee.sickUsed} jours
                      </div>
                      <Progress 
                        value={((selectedEmployee.sickBalance - selectedEmployee.sickUsed) / selectedEmployee.sickBalance) * 100}
                        className="mt-2 h-2"
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selectedEmployee.sickUsed} utilisés sur {selectedEmployee.sickBalance}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Informations</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Matricule</span>
                      <span className="font-mono">{selectedEmployee.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Département</span>
                      <span>{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Poste</span>
                      <span>{selectedEmployee.position}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Période</TableHead>
                        <TableHead>Durée</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveHistory.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell className="font-mono text-sm">{leave.id}</TableCell>
                          <TableCell>{leave.type}</TableCell>
                          <TableCell>{leave.startDate} → {leave.endDate}</TableCell>
                          <TableCell>{leave.days} jours</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-success/10 text-success">
                              Approuvé
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <ImportEmployeesDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        onImport={handleImportEmployees}
      />
    </div>
  );
}
