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
import { StatCard } from '@/components/ui/StatCard';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';

const departments = ['Ntic', 'Solicode', 'ibn marhal'];

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
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    prenom: '',
    nom_prenom: '',
    nom_ar: '',
    prenom_ar: '',  
    genre: '',
    actif: '',
    efp_travail: '',  
    fonction: '',
    nature_fonction: '',
    echelle: '',
    categorie: '',
    grade: '',
    cin: '',
    date_naissance: '',
    adresse: '',
    ville: '',
    telephone: '',
    email: '',
    password: '',
    diplome: '',
    specialite: '',
    date_recrutement: '',
    date_prise_service: '',
    recode_annee_ant: '',
    solde_annee_precedente: '',
    solde_annee_derniere: '',
    observation: '',
    photo: '',
    affectation: '',
    role: 'employee',
  });

  const getAllEmployees = async () => {
    try{
      const res = await axios.get("http://localhost:8000/api/users" , {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    });
      setEmployees(res.data);
    }
    catch(error){
      toast.error("Erreur lors du chargement des employés");
    }
  }
useEffect(() => {
  getAllEmployees();
}, []);
  const fileInputRef = useRef(null);
const handleImportExcel = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:8000/api/import-users", formData);
    if (res.status === 200) {
      toast.success("Employés importés avec succès");
      getAllEmployees(); // refresh
    } else {
      toast.error("Erreur lors de l'import");
    }
  } catch (error) {
    console.error("Import error:", error);
    toast.error("Erreur lors de l'import");
  }
  if (fileInputRef.current) fileInputRef.current.value = "";
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.put(`http://localhost:8000/api/users/${editingEmployee.id}`, formData , {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
  });

    toast.success("Employé modifié avec succès");

    getAllEmployees(); // refresh
    resetForm();
  } catch (error) {
    console.error(error);
    toast.error("Erreur lors de la modification");
  }
};
  const resetForm = () => {
    setFormData({ nom: '', email: '', telephone: '', affectation: '', role: 'employee'});
    setEditingEmployee(null);
    setIsDialogOpen(false);
  };

 const handleEdit = (employee) => {
  axios.get(`http://localhost:8000/api/users/${employee.id}`)
    .then(response => {
      const empData = response.data;

      setFormData({
        ...empData
      });
      
      console.log("Employee data for editing:", empData);
      setEditingEmployee(employee);
      setIsDialogOpen(true);
    })
    .catch(error => {
      console.error("Error fetching employee:", error);
      toast.error("Erreur lors du chargement");
    });
};
  const handleDelete =async (id) => {
      const supp=await axios.delete(`http://localhost:8000/api/users/${id}`);
      if(supp.status===200){
        toast.success("Employé supprimé avec succès");
        getAllEmployees();
      }
      else{
        toast.error("Erreur lors de la suppression");
      }
  };

  const filteredEmployees = employees.filter(emp => {
const matchesSearch =
  (emp.nom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
  (emp.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
const matchesDepartment = filterDepartment === 'all' || emp.affectation === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const stats = {
    total: employees.length,
    managers: employees.filter(e => e.role === 'manager').length,
avgLeave: Math.round(
  employees.reduce(
    (sum, e) =>
      sum +
      (Number(e.solde_annee_derniere) || 0) +
      (Number(e.solde_annee_precedente) || 0),
    0
  ) / (employees.length || 1)
),  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des employés</h1>
            <p className="text-muted-foreground">Gérez les employés et leurs soldes de congés</p>
          </div>
          <div className="flex gap-2">
<Button
  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
  onClick={() => fileInputRef.current?.click()}
>
  <FileSpreadsheet className="h-4 w-4" />
  Importer Excel
</Button>

<input
  ref={fileInputRef}
  type="file"
  accept=".xlsx, .xls, .csv"
  onChange={handleImportExcel}
  className="hidden"
/>
            <input ref={fileInputRef} type="file" accept=".xlsx, .xls, .csv" onChange={handleImportExcel} className="hidden" />
          </div>
        </div>

<Dialog open={isDialogOpen} onOpenChange={(open) => { 
  if (!open) resetForm(); 
  setIsDialogOpen(open); 
}}>
  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Modifier l'employé</DialogTitle>
    </DialogHeader>
    
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="nom">Nom *</Label>
          <Input 
            id="nom" 
            value={formData.nom} 
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })} 
            placeholder="Ex: Mohamed reda" 
          />
        </div>

        {/* Prénom */}
        <div className="space-y-2">
          <Label htmlFor="prenom">Prénom *</Label>
          <Input 
            id="prenom" 
            value={formData.prenom} 
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} 
            placeholder="Ex: Afellad" 
          />
        </div>

        {/* Nom complet */}
        <div className="space-y-2">
          <Label htmlFor="nom_prenom">Nom complet *</Label>
          <Input 
            id="nom_prenom" 
            value={formData.nom_prenom} 
            onChange={(e) => setFormData({ ...formData, nom_prenom: e.target.value })} 
            placeholder="Ex: Mohamed reda afellad" 
          />
        </div>

        {/* Nom en arabe */}
        <div className="space-y-2">
          <Label htmlFor="nom_ar">Nom en arabe</Label>
          <Input 
            id="nom_ar" 
            value={formData.nom_ar} 
            onChange={(e) => setFormData({ ...formData, nom_ar: e.target.value })} 
            placeholder="Ex: محمد رضا" 
          />
        </div>

        {/* Prénom en arabe */}
        <div className="space-y-2">
          <Label htmlFor="prenom_ar">Prénom en arabe</Label>
          <Input 
            id="prenom_ar" 
            value={formData.prenom_ar} 
            onChange={(e) => setFormData({ ...formData, prenom_ar: e.target.value })} 
            placeholder="Ex: أفلاط" 
          />
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input 
            id="genre" 
            value={formData.genre} 
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })} 
            placeholder="Ex: Masculin" 
          />
        </div>

        {/* Actif */}
        <div className="space-y-2">
          <Label htmlFor="actif">Actif</Label>
          <Input 
            id="actif" 
            value={formData.actif} 
            onChange={(e) => setFormData({ ...formData, actif: e.target.value })} 
            placeholder="Ex: Oui/Non" 
          />
        </div>

        {/* EFP travail */}
        <div className="space-y-2">
          <Label htmlFor="efp_travail">EFP travail</Label>
          <Input 
            id="efp_travail" 
            value={formData.efp_travail} 
            onChange={(e) => setFormData({ ...formData, efp_travail: e.target.value })} 
            placeholder="Ex: EFP1" 
          />
        </div>

        {/* Fonction */}
        <div className="space-y-2">
          <Label htmlFor="fonction">Fonction</Label>
          <Input 
            id="fonction" 
            value={formData.fonction} 
            onChange={(e) => setFormData({ ...formData, fonction: e.target.value })} 
            placeholder="Ex: Développeur" 
          />
        </div>

        {/* Nature de la fonction */}
        <div className="space-y-2">
          <Label htmlFor="nature_fonction">Nature de la fonction</Label>
          <Input 
            id="nature_fonction" 
            value={formData.nature_fonction} 
            onChange={(e) => setFormData({ ...formData, nature_fonction: e.target.value })} 
            placeholder="Ex: Permanent" 
          />
        </div>

        {/* Echelle */}
        <div className="space-y-2">
          <Label htmlFor="echelle">Echelle</Label>
          <Input 
            id="echelle" 
            value={formData.echelle} 
            onChange={(e) => setFormData({ ...formData, echelle: e.target.value })} 
            placeholder="Ex: Echelle 5" 
          />
        </div>

        {/* Catégorie */}
        <div className="space-y-2">
          <Label htmlFor="categorie">Catégorie</Label>
          <Input 
            id="categorie" 
            value={formData.categorie} 
            onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} 
            placeholder="Ex: Catégorie A" 
          />
        </div>

        {/* Grade */}
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Input 
            id="grade" 
            value={formData.grade} 
            onChange={(e) => setFormData({ ...formData, grade: e.target.value })} 
            placeholder="Ex: Grade 1" 
          />
        </div>

        {/* CIN */}
        <div className="space-y-2">
          <Label htmlFor="cin">CIN</Label>
          <Input 
            id="cin" 
            value={formData.cin} 
            onChange={(e) => setFormData({ ...formData, cin: e.target.value })} 
            placeholder="Ex: AB123456" 
          />
        </div>

        {/* Date de naissance */}
        <div className="space-y-2">
          <Label htmlFor="date_naissance">Date de naissance</Label>
          <Input 
            id="date_naissance" 
            type="date" 
            value={formData.date_naissance} 
            onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })} 
          />
        </div>

        {/* Adresse */}
        <div className="space-y-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input 
            id="adresse" 
            value={formData.adresse} 
            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} 
            placeholder="Ex: 123 Rue de Tanger" 
          />
        </div>

        {/* Ville */}
        <div className="space-y-2">
          <Label htmlFor="ville">Ville</Label>
          <Input 
            id="ville" 
            value={formData.ville} 
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })} 
            placeholder="Ex: Tanger" 
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            placeholder="email@ofppt.ma" 
          />
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <Label htmlFor="telephone">Téléphone</Label>
          <Input 
            id="telephone" 
            value={formData.telephone} 
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} 
            placeholder="06XXXXXXXX" 
          />
        </div>

        {/* Affectation */}
        <div className="space-y-2">
          <Label htmlFor="affectation">Affectation *</Label>
          <Select 
            value={formData.affectation} 
            onValueChange={(value) => setFormData({ ...formData, affectation: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Solde année précédente */}
        <div className="space-y-2">
          <Label htmlFor="solde_annee_precedente">Solde année précédente</Label>
          <Input
            id="solde_annee_precedente"
            type="number"
            value={formData.solde_annee_precedente}
            onChange={(e) => setFormData({ ...formData, solde_annee_precedente: e.target.value })}
            placeholder="Ex: 5"
          />
        </div>

        {/* Solde année dernière */}
        <div>
          <Label htmlFor="solde_annee_derniere">Solde année dernière</Label>
          <Input
            id="solde_annee_derniere"
            type="number"
            value={formData.solde_annee_derniere}
            onChange={(e) => setFormData({ ...formData, solde_annee_derniere: e.target.value })}
            placeholder="Ex: 10"
          />
        </div>

        {/* Rôle */}
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employé</SelectItem>
              <SelectItem value="manager">Responsable</SelectItem>
              <SelectItem value="director">Directeur</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={resetForm}>
          Annuler
        </Button>
        <Button type="submit">
          Modifier
        </Button>
      </div>
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
          <Select value={filterDepartment} onValueChange={setFilterDepartment}><SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Département" />
          </SelectTrigger><SelectContent><SelectItem value="all">Tous les départements</SelectItem>
          {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Liste des employés ({filteredEmployees.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Employé</TableHead><TableHead>Affectation</TableHead><TableHead>Rôle</TableHead><TableHead>Solde congés</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{employee.nom.split(' ').map(n => n[0]).join('')}</div><div><p className="font-medium">{employee.nom}</p><div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" />{employee.email}</div></div></div></TableCell>
                      <TableCell>{employee.affectation}</TableCell>
                      <TableCell><Badge variant={employee.role}>{employee.role}</Badge></TableCell>
                      <TableCell><span>{(Number(employee.solde_annee_derniere) || 0) + (Number(employee.solde_annee_precedente) || 0)}  jours</span></TableCell>
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