import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Plus, Trash2, Edit2, Check, X, 
  TrendingUp, CalendarDays, Clock, Search, Filter, Download, 
  BarChart3, PieChart, ChevronLeft, ChevronRight, FileText, 
  Moon, Sun, LayoutGrid, List, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useData } from '@/contexts/DataContext';
import toast from "react-hot-toast";
// const initialHolidays = [
//   { id: '1', name: "Jour de l'An",type: "national",date: '2026-01-01', is_recurring: true },
//   { id: '2', name: "Manifeste de l'Indépendance",type: "national", date: '2026-01-11', is_recurring: true },
//   { id: '3', name: "Fête du Travail",type: "national", date: '2026-05-01', is_recurring: true },
//   { id: '4', name: "Fête du Trône",type: "national", date: '2026-07-30', is_recurring: true },
//   { id: '5', name: "Oued Ed-Dahab",type: "national", date: '2026-08-14', is_recurring: true },
//   { id: '6', name: "Révolution du Roi et du Peuple",type: "national", date: '2026-08-20', is_recurring: true },
//   { id: '7', name: "Fête de la Jeunesse",type: "national", date: '2026-08-21', is_recurring: true },
//   { id: '8', name: "Marche Verte",type: "national", date: '2026-11-06', is_recurring: true },
//   { id: '9', name: "Fête de l'Indépendance",type: "national",date: '2026-11-18', is_recurring: true },
// ];

const Holidays = () => {
  const { removeHoliday, addHoliday, updateHoliday,holidays} = useData();
  const [initialHolidays, setHolidays] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecurring, setFilterRecurring] = useState('all'); 
  const [filterMonth, setFilterMonth] = useState('all');
  const [viewMode, setViewMode] = useState('table'); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({ name: '',type:'',date: '', is_recurring: true });
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
  if (holidays) {
    setHolidays(holidays);
  }
}, [holidays]);


  const currentYear = new Date().getFullYear();
  const months = eachMonthOfInterval({ start: new Date(currentYear, 0, 1), end: new Date(currentYear, 11, 31) });

  
  const filteredHolidays = useMemo(() => {
    console.log(holidays);
    return initialHolidays.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRecurring = filterRecurring === 'all' ? true : (filterRecurring === 'recurring' ? h.is_recurring : !h.is_recurring);
      const matchMonth = filterMonth === 'all' ? true : isSameMonth(new Date(h.date), new Date(currentYear, parseInt(filterMonth), 1));
      return matchSearch && matchRecurring && matchMonth;
    });
  }, [initialHolidays, searchTerm, filterRecurring, filterMonth, currentYear]);

  const sortedHolidays = [...filteredHolidays].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Statistiques
  const total = initialHolidays.length;
  const recurringCount = initialHolidays.filter(h => h.is_recurring).length;
  const upcomingCount = initialHolidays.filter(h => new Date(h.date) >= new Date()).length;
  const monthlyCount = months.map(month => initialHolidays.filter(h => isSameMonth(new Date(h.date), month)).length);
  const maxCount = Math.max(...monthlyCount, 1);

  // Répartition par mois pour le pie chart (simplifié)
  const pieData = months.map((month, idx) => ({ month: format(month, 'MMM', { locale: fr }), count: monthlyCount[idx] })).filter(d => d.count > 0);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.date) {
    alert("Veuillez remplir tous les champs");
    return;
  }

  try {
    if (editingHoliday) {
      await updateHoliday(editingHoliday.id, formData);
      toast.success(`${formData.name} a été mis à jour`);
    } else {
      await addHoliday(formData);
      toast.success(`${formData.name} a été ajouté au calendrier`);
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
    const holiday = initialHolidays.find(h => h.id === id);

    await removeHoliday(id); 

    toast.success(`${holiday?.name} a été retiré du calendrier`);
  } catch (error) {
    console.error(error);
    alert("Erreur suppression");
  }
};


  const exportCSV = () => {
    const csv = [["Nom","Type","Date", "Récurrent"]];
    initialHolidays.forEach(h => csv.push([h.name,h.type,h.date, h.is_recurring ? "Oui" : "Non"]));
    const blob = new Blob([csv.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jours_feries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Vue calendrier simplifiée
  const renderCalendar = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = [];
    let current = start;
    while (current <= end) {
      days.push(current);
      current = new Date(current.setDate(current.getDate() + 1));
    }
    return (
      <div className="grid grid-cols-7 gap-1">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => <div key={d} className="p-2 text-center text-xs font-semibold text-slate-500">{d}</div>)}
        {Array(start.getDay() === 0 ? 6 : start.getDay() - 1).fill(null).map((_, i) => <div key={`empty-${i}`} className="p-2" />)}
        {days.map(day => {
          const holiday = initialHolidays.find(h => isSameDay(new Date(h.date), day));
          return (
            <div key={day.toString()} className={`p-2 text-center rounded-lg ${holiday ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50'}`}>
              <div className="text-sm">{format(day, 'd')}</div>
              {holiday && <div className="text-[10px] truncate">{holiday.name}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div >
        <div>
          {/* En-tête avec actions */}
<div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

  {/* Title */}
  <div>
    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
      📅 Jours fériés
    </h1>

    <p className="text-sm text-slate-500 mt-1">
      Tableau de bord exécutif • Année {currentYear}
    </p>
  </div>

  {/* Actions */}
  <div className="flex flex-wrap items-center gap-2">
    {/* Add Button */}
<button
  onClick={() => setIsDialogOpen(true)}
  className="flex items-center gap-2 h-10 px-4 rounded-md bg-gray-100 text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-200 transition"
>
  <Plus className="h-4 w-4" />
  Ajouter
</button>
  </div>
</div>

          {/* KPIs */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

          {/* Card */}
          <div className="group rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:scale-110 transition">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{total}</p>
          </div>

          {/* Card */}
          <div className="group rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 group-hover:scale-110 transition">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <p className="text-xs text-slate-500">Récurrents</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{recurringCount}</p>
          </div>

          {/* Card */}
          <div className="group rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 group-hover:scale-110 transition">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-xs text-slate-500">À venir</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{upcomingCount}</p>
          </div>

          {/* Card */}
          <div className="group rounded-2xl bg-white/80 backdrop-blur p-5 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:scale-110 transition">
                  <RefreshCw className="h-4 w-4" />
                </div>
                <p className="text-xs text-slate-500">Taux récurrence</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {total > 0 ? Math.round((recurringCount / total) * 100) : 0}%
            </p>
          </div>

        </div>

          {/* Filtres et vue */}
<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

  {/* LEFT SIDE */}
  <div className="flex flex-wrap items-center gap-3">

    {/* Search */}
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition" />
      <input
        type="text"
        placeholder="Rechercher..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-10 w-52 rounded-xl border border-slate-200 bg-white/80 backdrop-blur pl-9 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
      />
    </div>

    {/* Recurring Filter */}
    <select
      value={filterRecurring}
      onChange={(e) => setFilterRecurring(e.target.value)}
      className="h-10 rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
    >
      <option value="all">Tous</option>
      <option value="recurring">Récurrents</option>
      <option value="once">Ponctuels</option>
    </select>

    {/* Month Filter */}
    <select
      value={filterMonth}
      onChange={(e) => setFilterMonth(e.target.value)}
      className="h-10 rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-3 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
    >
      <option value="all">Tous les mois</option>
      {months.map((m, i) => (
        <option key={i} value={i}>
          {format(m, 'MMMM', { locale: fr })}
        </option>
      ))}
    </select>

  </div>

  {/* RIGHT SIDE (VIEW SWITCH) */}
  <div className="flex items-center rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-1 shadow-sm">

    <button
      onClick={() => setViewMode('table')}
      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        viewMode === 'table'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <List className="h-4 w-4" />
      Table
    </button>

    <button
      onClick={() => setViewMode('calendar')}
      className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        viewMode === 'calendar'
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      <LayoutGrid className="h-4 w-4" />
      Calendrier
    </button>

  </div>

</div>

          {/* Statistiques (graphiques) */}
  

          {/* Contenu principal: tableau ou calendrier */}
          <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
            {viewMode === 'table' ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 backdrop-blur shadow-sm">

              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  {/* HEADER */}
                  <thead className="bg-slate-50/80 backdrop-blur border-b border-slate-200 sticky top-0 z-10">
                    <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      <th className="px-6 py-3">Nom</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Récurrence</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  {/* BODY */}
                  <tbody className="divide-y divide-slate-100">

                    {sortedHolidays.map((holiday) => (
                      <tr
                        key={holiday.id}
                        className="group hover:bg-slate-50/70 transition"
                      >

                        {/* NAME */}
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {holiday.name}
                        </td>

                        {/* DATE */}
                        <td className="px-6 py-4 text-slate-500">
                          {format(new Date(holiday.date), 'EEEE d MMMM yyyy', { locale: fr })}
                        </td>

                        {/* TYPE */}
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                            {holiday.type}
                          </span>
                        </td>

                        {/* RECURRING */}
                        <td className="px-6 py-4">
                          {holiday.is_recurring ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                              <Check className="h-3 w-3" />
                              Annuel
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              <X className="h-3 w-3" />
                              Unique
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">

                            <button
                              onClick={() => handleEdit(holiday)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(holiday.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))}

                    {/* EMPTY STATE */}
                    {sortedHolidays.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center">
                          <p className="text-slate-400 text-sm">Aucune donnée</p>
                        </td>
                      </tr>
                    )}

                  </tbody>
                </table>
              </div>
            </div>
            ) : (
             <div className="p-5 rounded-2xl bg-white/80 backdrop-blur border border-slate-200 shadow-sm">

  <div className="flex items-center justify-between mb-5">

    {/* Prev Button */}
    <button
      onClick={() =>
        setSelectedDate(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
        )
      }
      className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition"
    >
      <ChevronLeft className="h-5 w-5" />
    </button>

    {/* Month Title */}
    <h2 className="text-base font-semibold text-slate-800 tracking-wide">
      {format(selectedDate, 'MMMM yyyy', { locale: fr })}
    </h2>

    {/* Next Button */}
    <button
      onClick={() =>
        setSelectedDate(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
        )
      }
      className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition"
    >
      <ChevronRight className="h-5 w-5" />
    </button>

  </div>

  {/* Calendar */}
  <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
    {renderCalendar()}
  </div>

</div>
            )}
          </div>
          <div className="mt-4 text-right text-xs text-slate-400">Dernière mise à jour : {format(new Date(), 'dd/MM/yyyy HH:mm')}</div>
        </div>
      </div>

      {/* Modal amélioré */}
      <AnimatePresence>{isDialogOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => e.target===e.currentTarget && setIsDialogOpen(false)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-md rounded-2xl bg-white shadow-xl"><div className="border-b p-5"><h3 className="text-lg font-semibold">{editingHoliday ? 'Modifier' : 'Ajouter'} un jour férié</h3></div><form onSubmit={handleSubmit} className="p-5 space-y-4"><div><label className="block text-sm font-medium">Nom</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" required /></div><div>
  <label className="block text-sm font-medium text-slate-700">
    Type
  </label>

  <div className="relative mt-1">
    <select
      value={formData.type}
      onChange={(e) =>
        setFormData({ ...formData, type: e.target.value })
      }
      className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
      required
    >
      <option value="">Choisir un type</option>
      <option value="national">National</option>
      <option value="religieux">Religieux</option>
      <option value="entreprise">Entreprise</option>
      <option value="autre">Autre</option>
    </select>

    {/* Arrow icon */}
    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400">
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
</div>
<div>
  <label className="block text-sm font-medium">Date</label>
<input
  type="date"
  value={formData.date}
  onChange={e => setFormData({ ...formData, date: e.target.value })}
  onMouseDown={(e) => {
    e.currentTarget.showPicker?.();
  }}
  className="mt-1 w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2"
  required
/>  </div><label className="flex items-center gap-2 text-sm">
    <input type="checkbox" checked={formData.is_recurring} onChange={e=>setFormData({...formData,is_recurring:e.target.checked})} className="rounded" />
     Récurrent chaque année</label>
     <div className="flex gap-3 pt-4">
      <button type="button" onClick={()=>setIsDialogOpen(false)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2">Annuler</button>
      <button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white">{editingHoliday ? 'Modifier' : 'Ajouter'}</button>
      </div>
      </form>
      </motion.div>
      </motion.div>}
      </AnimatePresence>
    </DashboardLayout>
  );
};
export default Holidays;