import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit2, Trash2, Mail, Building, Upload, FileSpreadsheet, ChevronLeft, ChevronRight } from 'lucide-react';
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

const departments = ['Ntic', 'Solicode', 'ista IBN MARHAL'];

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
  const [loading, setLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const initialFormData = {
    matricule: '',
    nom: '',
    prenom: '',
    nom_prenom: '',
    nom_ar: '',
    prenom_ar: '',
    sexe: '',
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
  };
  const [formData, setFormData] = useState(initialFormData);

  const getAllEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(res.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des employés");
    } finally {
      setLoading(false);
    }
  };

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
        getAllEmployees();
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
      await axios.put(`http://localhost:8000/api/users/${editingEmployee.id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      toast.success("Employé modifié avec succès");
      getAllEmployees();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification");
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingEmployee(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (employee) => {
    axios.get(`http://localhost:8000/api/users/${employee.id}`)
      .then((response) => {
        const emp = response.data;
        const flat = {
          ...initialFormData,
          ...(emp || {}),
          ...(emp.detail_user || {}),
          ...(emp.detail_job_user || {}),
        };
        setFormData(flat);
        setEditingEmployee(emp);
        setIsDialogOpen(true);
      })
      .catch(() => {
        toast.error("Erreur lors du chargement");
      });
  };

  const handleDelete = async (id) => {
    const supp = await axios.delete(`http://localhost:8000/api/users/${id}`);
    if (supp.status === 200) {
      toast.success("Employé supprimé avec succès");
      getAllEmployees();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Filtrage
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      (emp.nom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (emp.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || emp.affectation === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterDepartment]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Génération des numéros de page avec ellipsis
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

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
    ),
  };

  // Composant squelette pour le tableau (responsif)
  const TableSkeleton = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted rounded-md animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-5 gap-4 mb-6 pb-2 border-b">
                {['Employé', 'Affectation', 'Rôle', 'Solde congés', 'Actions'].map((header, i) => (
                  <div key={i} className="h-4 bg-muted/60 rounded animate-pulse" />
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-40 bg-muted/60 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="flex justify-end gap-2">
                      <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                      <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-3 mt-8 pt-4 border-t">
            <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Chargement des employés...</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 px-2 sm:px-0">
        {/* Header responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Gestion des employés</h1>
            <p className="text-sm text-muted-foreground">Gérez les employés et leurs soldes de congés</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="gap-2 bg-green-600 hover:bg-green-700 text-white text-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline">Importer Excel</span>
              <span className="sm:hidden">Importer</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleImportExcel}
              className="hidden"
            />
          </div>
        </div>

        {/* Dialog de modification - responsive */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Modifier l'employé</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Champs du formulaire (identiques) */}
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    value={formData.nom || ''}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    placeholder="Ex: Mohamed reda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    value={formData.prenom || ''}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    placeholder="Ex: Afellad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom_prenom">Nom complet *</Label>
                  <Input
                    id="nom_prenom"
                    value={formData.nom_prenom || ''}
                    onChange={(e) => setFormData({ ...formData, nom_prenom: e.target.value })}
                    placeholder="Ex: Mohamed reda afellad"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom_ar">Nom en arabe</Label>
                  <Input
                    id="nom_ar"
                    value={formData.nom_ar || ''}
                    onChange={(e) => setFormData({ ...formData, nom_ar: e.target.value })}
                    placeholder="Ex: محمد رضا"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom_ar">Prénom en arabe</Label>
                  <Input
                    id="prenom_ar"
                    value={formData.prenom_ar || ''}
                    onChange={(e) => setFormData({ ...formData, prenom_ar: e.target.value })}
                    placeholder="Ex: أفلاط"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sexe">Sexe</Label>
                  <Input
                    id="sexe"
                    value={formData.sexe || ''}
                    onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                    placeholder="Ex: Masculin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actif">Actif</Label>
                  <Input
                    id="actif"
                    value={formData.actif || ''}
                    onChange={(e) => setFormData({ ...formData, actif: e.target.value })}
                    placeholder="Ex: Oui/Non"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="efp_travail">EFP travail</Label>
                  <Input
                    id="efp_travail"
                    value={formData.efp_travail || ''}
                    onChange={(e) => setFormData({ ...formData, efp_travail: e.target.value })}
                    placeholder="Ex: EFP1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fonction">Fonction</Label>
                  <Input
                    id="fonction"
                    value={formData.fonction || ''}
                    onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
                    placeholder="Ex: Développeur"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nature_fonction">Nature de la fonction</Label>
                  <Input
                    id="nature_fonction"
                    value={formData.nature_fonction || ''}
                    onChange={(e) => setFormData({ ...formData, nature_fonction: e.target.value })}
                    placeholder="Ex: Permanent"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="echelle">Echelle</Label>
                  <Input
                    id="echelle"
                    value={formData.echelle || ''}
                    onChange={(e) => setFormData({ ...formData, echelle: e.target.value })}
                    placeholder="Ex: Echelle 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categorie">Catégorie</Label>
                  <Input
                    id="categorie"
                    value={formData.categorie || ''}
                    onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    placeholder="Ex: Catégorie A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={formData.grade || ''}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="Ex: Grade 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cin">CIN</Label>
                  <Input
                    id="cin"
                    value={formData.cin || ''}
                    onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                    placeholder="Ex: AB123456"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_naissance">Date de naissance</Label>
                  <Input
                    id="date_naissance"
                    type="date"
                    value={formData.date_naissance || ''}
                    onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <Input
                    id="adresse"
                    value={formData.adresse || ''}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    placeholder="Ex: 123 Rue de Tanger"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.ville || ''}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Ex: Tanger"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@ofppt.ma"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="06XXXXXXXX"
                  />
                </div>
               {/* Affectation */}
                <div className="space-y-2">
                  <Label htmlFor="affectation">Affectation *</Label>

                  <Input
                    id="affectation"
                    type="text"
                    placeholder="Entrer l'affectation"
                    value={formData.affectation || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        affectation: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="solde_annee_precedente">Solde année précédente</Label>
                  <Input
                    id="solde_annee_precedente"
                    type="number"
                    value={formData.solde_annee_precedente || ''}
                    onChange={(e) => setFormData({ ...formData, solde_annee_precedente: e.target.value })}
                    placeholder="Ex: 5"
                  />
                </div>
                <div>
                  <Label htmlFor="solde_annee_derniere">Solde année dernière</Label>
                  <Input
                    id="solde_annee_derniere"
                    type="number"
                    value={formData.solde_annee_derniere || ''}
                    onChange={(e) => setFormData({ ...formData, solde_annee_derniere: e.target.value })}
                    placeholder="Ex: 10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={formData.role || ''}
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
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
                <Button type="submit">Modifier</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Stats Cards - déjà responsive */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <StatCard title="Total employés" value={stats.total} icon={Users} />
          <StatCard title="Responsables" value={stats.managers} icon={Building} variant="warning" />
          <StatCard title="Solde moyen" value={`${stats.avgLeave} jours`} icon={Users} variant="success" />
        </div>

        {/* Filtres responsives */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full sm:w-48">
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

        {loading ? (
          <TableSkeleton />
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Liste des employés ({filteredEmployees.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Tableau avec scroll horizontal */}
                <div className="overflow-x-auto">
                  <Table className="min-w-[640px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employé</TableHead>
                        <TableHead>Affectation</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Solde congés</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {employee.nom?.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="font-medium">{employee.nom}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {employee.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{employee.affectation}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">{employee.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {(Number(employee.solde_annee_derniere) || 0) +
                              (Number(employee.solde_annee_precedente) || 0)} jours
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)} className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {paginatedEmployees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                            Aucun employé trouvé
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination responsive */}
                {filteredEmployees.length > 0 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Lignes par page :</span>
                      <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => {
                          setItemsPerPage(Number(value));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Précédent</span>
                      </Button>
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, idx) => (
                          typeof page === 'number' ? (
                            <Button
                              key={idx}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          ) : (
                            <span key={idx} className="px-2 text-muted-foreground">...</span>
                          )
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="hidden sm:inline">Suivant</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}