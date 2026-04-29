import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit2, Trash2, Mail, Building, Upload, FileSpreadsheet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { StatCard } from '@/components/ui/StatCard';
import * as XLSX from 'xlsx';

const initialEmployees = [
  { id: '1', name: 'Ahmed El Mansouri', email: 'ahmed.elmansouri@ofppt.ma', phone: '0612345678', department: 'Formation', role: 'employee', leaveBalance: 22, joinDate: '2020-03-15' },
  { id: '2', name: 'Fatima Benali', email: 'fatima.benali@ofppt.ma', phone: '0623456789', department: 'Administration', role: 'employee', leaveBalance: 18, joinDate: '2019-07-01' },
  { id: '3', name: 'Mohammed Alaoui', email: 'responsable@ofppt.ma', phone: '0634567890', department: 'Formation', role: 'manager', leaveBalance: 25, joinDate: '2018-01-10' },
  { id: '4', name: 'Sara Tazi', email: 'sara.tazi@ofppt.ma', phone: '0645678901', department: 'RH', role: 'employee', leaveBalance: 20, joinDate: '2021-09-01' },
  { id: '5', name: 'Youssef Idrissi', email: 'youssef.idrissi@ofppt.ma', phone: '0656789012', department: 'Technique', role: 'employee', leaveBalance: 15, joinDate: '2022-02-20' },
  { id: '6', name: 'Khadija Moussaoui', email: 'directeur@ofppt.ma', phone: '0667890123', department: 'Direction', role: 'director', leaveBalance: 30, joinDate: '2015-06-01' },
];

const departments = ['Formation', 'Administration', 'RH', 'Technique', 'Direction', 'Finance'];

const roleLabels = {
  employee: 'Employé',
  manager: 'Responsable',
  director: 'Directeur',
};

const roleMapping = {
  'employé': 'employee',
  'employe': 'employee',
  'employee': 'employee',
  'responsable': 'manager',
  'manager': 'manager',
  'directeur': 'director',
  'director': 'director',
};

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: 'employee',
    leaveBalance: 22,
  });
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleImportExcel = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonData || jsonData.length === 0) {
          toast({ title: 'Fichier vide', description: 'Le fichier Excel ne contient aucune donnée.', variant: 'destructive' });
          return;
        }

        const newEmployees = [];
        const errors = [];

        jsonData.forEach((row, index) => {
          const name = row['Nom'] || row['Name'] || row['NOM'] || row['name'];
          const email = row['Email'] || row['EMAIL'] || row['email'];
          const phone = row['Téléphone'] || row['Phone'] || row['TELEPHONE'] || row['phone'] || '';
          const department = row['Département'] || row['Department'] || row['DEPARTEMENT'] || row['department'];
          let roleRaw = row['Rôle'] || row['Role'] || row['ROLE'] || row['role'] || 'employee';
          let leaveBalanceRaw = row['Solde congés'] || row['LeaveBalance'] || row['Solde'] || row['leaveBalance'];

          const roleKey = roleRaw.toString().toLowerCase().trim();
          const role = roleMapping[roleKey] || 'employee';

          let leaveBalance = 22;
          if (leaveBalanceRaw !== undefined) {
            const parsed = parseInt(leaveBalanceRaw);
            if (!isNaN(parsed)) leaveBalance = Math.min(60, Math.max(0, parsed));
          }

          if (!name || !email || !department) {
            errors.push(`Ligne ${index + 2}: Nom, Email et Département sont requis.`);
            return;
          }
          if (!email.includes('@')) {
            errors.push(`Ligne ${index + 2}: Email invalide.`);
            return;
          }
          const emailExists = employees.some(emp => emp.email === email) || newEmployees.some(emp => emp.email === email);
          if (emailExists) {
            errors.push(`Ligne ${index + 2}: L'email ${email} existe déjà.`);
            return;
          }

          newEmployees.push({
            id: Date.now() + index.toString(),
            name: name.toString().trim(),
            email: email.toString().trim(),
            phone: phone.toString().trim(),
            department: department.toString().trim(),
            role,
            leaveBalance,
            joinDate: new Date().toISOString().split('T')[0],
          });
        });

        if (errors.length > 0) {
          toast({ title: 'Erreurs dans le fichier', description: errors.slice(0, 3).join(', ') + (errors.length > 3 ? ` et ${errors.length - 3} autres` : ''), variant: 'destructive' });
        }
        if (newEmployees.length > 0) {
          setEmployees(prev => [...prev, ...newEmployees]);
          toast({ title: 'Import réussi', description: `${newEmployees.length} employé(s) ont été ajoutés.` });
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        toast({ title: 'Erreur de lecture', description: 'Le fichier est invalide ou corrompu.', variant: 'destructive' });
      }
    };
    reader.onerror = () => toast({ title: 'Erreur', description: 'Impossible de lire le fichier.', variant: 'destructive' });
    reader.readAsBinaryString(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!editingEmployee) {
      toast({ title: 'Action non autorisée', description: "Utilisez l'import Excel pour ajouter des employés.", variant: 'destructive' });
      return;
    }
    if (!formData.name || !formData.email || !formData.department) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs obligatoires', variant: 'destructive' });
      return;
    }
    setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...formData } : emp));
    toast({ title: 'Employé modifié', description: `${formData.name} a été mis à jour` });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', department: '', role: 'employee', leaveBalance: 22 });
    setEditingEmployee(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      leaveBalance: employee.leaveBalance,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    const employee = employees.find(e => e.id === id);
    setEmployees(employees.filter(e => e.id !== id));
    toast({ title: 'Employé supprimé', description: `${employee?.name} a été retiré de l'équipe` });
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const stats = {
    total: employees.length,
    managers: employees.filter(e => e.role === 'manager').length,
    avgLeave: Math.round(employees.reduce((sum, e) => sum + e.leaveBalance, 0) / employees.length),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des employés</h1>
            <p className="text-muted-foreground">Gérez les employés et leurs soldes de congés</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Importer Excel
            </Button>
            <input ref={fileInputRef} type="file" accept=".xlsx, .xls, .csv" onChange={handleImportExcel} className="hidden" />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Modifier l'employé</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Nom complet *</Label><Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Ahmed El Mansouri" /></div>
              <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@ofppt.ma" /></div>
              <div className="space-y-2"><Label htmlFor="phone">Téléphone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="06XXXXXXXX" /></div>
              <div className="space-y-2"><Label htmlFor="department">Département *</Label><Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}><SelectTrigger><SelectValue placeholder="Sélectionner un département" /></SelectTrigger><SelectContent>{departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="role">Rôle</Label><Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="employee">Employé</SelectItem><SelectItem value="manager">Responsable</SelectItem><SelectItem value="director">Directeur</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="leaveBalance">Solde de congés (jours)</Label><Input id="leaveBalance" type="number" min="0" max="60" value={formData.leaveBalance} onChange={(e) => setFormData({ ...formData, leaveBalance: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex justify-end gap-2 pt-2"><Button type="button" variant="outline" onClick={resetForm}>Annuler</Button><Button type="submit">Modifier</Button></div>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard title="Total employés" value={stats.total} icon={Users} />
          <StatCard title="Responsables" value={stats.managers} icon={Building} variant="warning" />
          <StatCard title="Solde moyen" value={`${stats.avgLeave} jours`} icon={Users} variant="success" />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Rechercher par nom ou email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}><SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Département" /></SelectTrigger><SelectContent><SelectItem value="all">Tous les départements</SelectItem>{departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}</SelectContent></Select>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Liste des employés ({filteredEmployees.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Employé</TableHead><TableHead>Département</TableHead><TableHead>Rôle</TableHead><TableHead>Solde congés</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{employee.name.split(' ').map(n => n[0]).join('')}</div><div><p className="font-medium">{employee.name}</p><div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{employee.email}</div></div></div></TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell><Badge variant={employee.role === 'director' ? 'default' : employee.role === 'manager' ? 'secondary' : 'outline'}>{roleLabels[employee.role]}</Badge></TableCell>
                      <TableCell><span className={employee.leaveBalance < 10 ? 'text-destructive font-medium' : ''}>{employee.leaveBalance} jours</span></TableCell>
                      <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => handleEdit(employee)}><Edit2 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}