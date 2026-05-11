import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useData } from '@/contexts/DataContext';

const initialHolidays = [
  { id: '1', name: "Jour de l'An", date: '2025-01-01', is_recurring: true },
  { id: '2', name: "Manifeste de l'Indépendance", date: '2025-01-11', is_recurring: true },
  { id: '3', name: "Fête du Travail", date: '2025-05-01', is_recurring: true },
  { id: '4', name: "Fête du Trône", date: '2025-07-30', is_recurring: true },
  { id: '5', name: "Oued Ed-Dahab", date: '2025-08-14', is_recurring: true },
  { id: '6', name: "Révolution du Roi et du Peuple", date: '2025-08-20', is_recurring: true },
  { id: '7', name: "Fête de la Jeunesse", date: '2025-08-21', is_recurring: true },
  { id: '8', name: "Marche Verte", date: '2025-11-06', is_recurring: true },
  { id: '9', name: "Fête de l'Indépendance", date: '2025-11-18', is_recurring: true },
];

const Holidays = () => {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({ name: '',type: '', date: '', is_recurring: true });

  const { removeHoliday, addHoliday, updateHoliday} = useData();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.date) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  try {
    if (editingHoliday) {
      await updateHoliday(editingHoliday.id, formData);
      alert(`${formData.name} a été mis à jour`);
    } else {
      await addHoliday(formData);
      alert(`${formData.name} a été ajouté au calendrier`);
    }

    setFormData({ name: '', date: '', is_recurring: true });
    setEditingHoliday(null);
    setIsDialogOpen(false);

  } catch (error) {
    console.error(error);
    alert("Erreur serveur");
  }
};

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({ name: holiday.name, date: holiday.date, isRecurring: holiday.isRecurring });
    setIsDialogOpen(true);
  };

 const handleDelete = async (id) => {
  try {
    const holiday = holidays.find(h => h.id === id);

    await removeHoliday(id); 

    alert(`${holiday?.name} a été retiré du calendrier`);
  } catch (error) {
    console.error(error);
    alert("Erreur suppression");
  }
};

  const sortedHolidays = [...holidays].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Jours fériés</h1>
            <p className="text-muted-foreground">Gérez le calendrier des jours fériés</p>
          </div>
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter un jour férié
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="rounded-t-lg border-b p-6">
              <h2 className="text-xl font-semibold">
                <Calendar className="inline h-5 w-5 text-primary mr-2" />
                Calendrier {new Date().getFullYear()}
              </h2>
            </div>
            <div className="p-6">
              <div className="rounded-md border overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground/90 [&:has([role=checkbox])]:pr-0">Jour férié</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground/90 [&:has([role=checkbox])]:pr-0">Date</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground/90 [&:has([role=checkbox])]:pr-0">Récurrent</th>
                      <th className="text-right h-12 px-4 align-middle font-medium text-muted-foreground/90 [&:has([role=checkbox])]:pr-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedHolidays.map((holiday) => (
                      <tr key={holiday.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="border-b p-4 align-middle font-medium">{holiday.name}</td>
                        <td className="border-b p-4 align-middle">{format(new Date(holiday.date), 'EEEE d MMMM yyyy', { locale: fr })}</td>
                        <td className="border-b p-4 align-middle">
                          {holiday.isRecurring ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                          )}
                        </td>
                        <td className="border-b p-4 text-right align-middle">
                          <div className="flex justify-end gap-1">
                            <button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent h-9 w-9 border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg~*]:pl-2"
                              onClick={() => handleEdit(holiday)}
                              type="button"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-destructive hover:text-destructive-foreground h-9 w-9 border bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg~*]:pl-2 text-destructive"
                              onClick={() => handleDelete(holiday.id)}
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Simple Modal */}
        {isDialogOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsDialogOpen(false);
                setEditingHoliday(null);
                setFormData({ name: '', date: '', isRecurring: true });
              }
            }}
          >
            <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-2xl">
              <h3 className="mb-6 text-lg font-semibold">
                {editingHoliday ? 'Modifier jour férié' : 'Ajouter jour férié'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nom
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Fête nationale"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.showPicker?.();
                  }}
                  className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  required
                />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Récurrent chaque année
                </label>
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    className="flex-1 rounded-md border bg-background px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingHoliday(null);
                      setFormData({ name: '', date: '', isRecurring: true });
                    }}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {editingHoliday ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Holidays;

