import { useState } from "react";
import { Calendar, Plus, Edit2, Trash2, Flag, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "national" | "religious";
  recurring: boolean;
}

const holidays: Holiday[] = [
  { id: "1", name: "Jour de l'An", date: "01/01/2024", type: "national", recurring: true },
  { id: "2", name: "Manifeste de l'Indépendance", date: "11/01/2024", type: "national", recurring: true },
  { id: "3", name: "Aïd Al Fitr", date: "10/04/2024", type: "religious", recurring: false },
  { id: "4", name: "Aïd Al Fitr (2ème jour)", date: "11/04/2024", type: "religious", recurring: false },
  { id: "5", name: "Fête du Travail", date: "01/05/2024", type: "national", recurring: true },
  { id: "6", name: "Aïd Al Adha", date: "17/06/2024", type: "religious", recurring: false },
  { id: "7", name: "Aïd Al Adha (2ème jour)", date: "18/06/2024", type: "religious", recurring: false },
  { id: "8", name: "Fête du Trône", date: "30/07/2024", type: "national", recurring: true },
  { id: "9", name: "1er Moharram", date: "08/07/2024", type: "religious", recurring: false },
  { id: "10", name: "Oued Ed-Dahab", date: "14/08/2024", type: "national", recurring: true },
  { id: "11", name: "Révolution du Roi et du Peuple", date: "20/08/2024", type: "national", recurring: true },
  { id: "12", name: "Fête de la Jeunesse", date: "21/08/2024", type: "national", recurring: true },
  { id: "13", name: "Aïd Al Mawlid", date: "16/09/2024", type: "religious", recurring: false },
  { id: "14", name: "Marche Verte", date: "06/11/2024", type: "national", recurring: true },
  { id: "15", name: "Fête de l'Indépendance", date: "18/11/2024", type: "national", recurring: true },
];

export default function Holidays() {
  const [year, setYear] = useState(2024);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredHolidays = holidays.filter((holiday) => {
    return typeFilter === "all" || holiday.type === typeFilter;
  });

  const nationalCount = holidays.filter(h => h.type === "national").length;
  const religiousCount = holidays.filter(h => h.type === "religious").length;

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingHoliday(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Jours fériés</h1>
        <p className="page-subtitle">
          Gérez les jours fériés nationaux et religieux
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total jours fériés
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holidays.length}</div>
            <p className="text-xs text-muted-foreground">Pour l'année {year}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fêtes nationales
            </CardTitle>
            <Flag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nationalCount}</div>
            <p className="text-xs text-muted-foreground">Récurrents chaque année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fêtes religieuses
            </CardTitle>
            <Moon className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{religiousCount}</div>
            <p className="text-xs text-muted-foreground">Dates variables</p>
          </CardContent>
        </Card>
      </div>

      {/* Year Selector & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setYear(year - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="w-24 text-center">
            <span className="text-lg font-semibold">{year}</span>
          </div>
          <Button variant="outline" size="icon" onClick={() => setYear(year + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="national">Fêtes nationales</SelectItem>
              <SelectItem value="religious">Fêtes religieuses</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter un jour férié
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du jour férié</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Récurrent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHolidays.map((holiday) => (
              <TableRow key={holiday.id}>
                <TableCell className="font-medium">{holiday.name}</TableCell>
                <TableCell>{holiday.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={holiday.type === "national" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-chart-5/10 text-chart-5"
                    }
                  >
                    {holiday.type === "national" ? (
                      <><Flag className="mr-1 h-3 w-3" /> National</>
                    ) : (
                      <><Moon className="mr-1 h-3 w-3" /> Religieux</>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  {holiday.recurring ? (
                    <span className="text-success">Oui</span>
                  ) : (
                    <span className="text-muted-foreground">Non</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(holiday)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingHoliday ? "Modifier le jour férié" : "Ajouter un jour férié"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du jour férié</Label>
              <Input 
                id="name" 
                placeholder="Ex: Fête du Trône"
                defaultValue={editingHoliday?.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select defaultValue={editingHoliday?.type || "national"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">Fête nationale</SelectItem>
                  <SelectItem value="religious">Fête religieuse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Récurrent annuellement</Label>
                <p className="text-sm text-muted-foreground">
                  Ce jour férié se répète chaque année
                </p>
              </div>
              <Switch defaultChecked={editingHoliday?.recurring} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingHoliday ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
