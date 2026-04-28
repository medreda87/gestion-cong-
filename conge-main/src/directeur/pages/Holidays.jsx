import { useState, useMemo } from 'react';
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

const initialHolidays = [
  { id: '1', name: "Jour de l'An", date: '2026-01-01', isRecurring: true },
  { id: '2', name: "Manifeste de l'Indépendance", date: '2026-01-11', isRecurring: true },
  { id: '3', name: "Fête du Travail", date: '2026-05-01', isRecurring: true },
  { id: '4', name: "Fête du Trône", date: '2026-07-30', isRecurring: true },
  { id: '5', name: "Oued Ed-Dahab", date: '2026-08-14', isRecurring: true },
  { id: '6', name: "Révolution du Roi et du Peuple", date: '2026-08-20', isRecurring: true },
  { id: '7', name: "Fête de la Jeunesse", date: '2026-08-21', isRecurring: true },
  { id: '8', name: "Marche Verte", date: '2026-11-06', isRecurring: true },
  { id: '9', name: "Fête de l'Indépendance", date: '2026-11-18', isRecurring: true },
];

const Holidays = () => {
  const [holidays, setHolidays] = useState(initialHolidays);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecurring, setFilterRecurring] = useState('all'); // all, recurring, once
  const [filterMonth, setFilterMonth] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // table, calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({ name: '', date: '', isRecurring: true });
  const [showStats, setShowStats] = useState(true);

  const currentYear = new Date().getFullYear();
  const months = eachMonthOfInterval({ start: new Date(currentYear, 0, 1), end: new Date(currentYear, 11, 31) });

  // Filtrage
  const filteredHolidays = useMemo(() => {
    return holidays.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRecurring = filterRecurring === 'all' ? true : (filterRecurring === 'recurring' ? h.isRecurring : !h.isRecurring);
      const matchMonth = filterMonth === 'all' ? true : isSameMonth(new Date(h.date), new Date(currentYear, parseInt(filterMonth), 1));
      return matchSearch && matchRecurring && matchMonth;
    });
  }, [holidays, searchTerm, filterRecurring, filterMonth, currentYear]);

  const sortedHolidays = [...filteredHolidays].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Statistiques
  const total = holidays.length;
  const recurringCount = holidays.filter(h => h.isRecurring).length;
  const upcomingCount = holidays.filter(h => new Date(h.date) >= new Date()).length;
  const monthlyCount = months.map(month => holidays.filter(h => isSameMonth(new Date(h.date), month)).length);
  const maxCount = Math.max(...monthlyCount, 1);

  // Répartition par mois pour le pie chart (simplifié)
  const pieData = months.map((month, idx) => ({ month: format(month, 'MMM', { locale: fr }), count: monthlyCount[idx] })).filter(d => d.count > 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) return;
    if (editingHoliday) {
      setHolidays(holidays.map(h => h.id === editingHoliday.id ? { ...h, ...formData } : h));
    } else {
      setHolidays([...holidays, { id: Date.now().toString(), ...formData }]);
    }
    setFormData({ name: '', date: '', isRecurring: true });
    setEditingHoliday(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({ name: holiday.name, date: holiday.date, isRecurring: holiday.isRecurring });
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Confirmer la suppression ?")) setHolidays(holidays.filter(h => h.id !== id));
  };

  const exportCSV = () => {
    const csv = [["Nom", "Date", "Récurrent"]];
    holidays.forEach(h => csv.push([h.name, h.date, h.isRecurring ? "Oui" : "Non"]));
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
          const holiday = holidays.find(h => isSameDay(new Date(h.date), day));
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
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* En-tête avec actions */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">📅 Jours fériés</h1>
              <p className="text-sm text-slate-500">Tableau de bord exécutif • Année {currentYear}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowStats(!showStats)} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
                {showStats ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={exportCSV} className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
                <Download className="h-4 w-4" />
              </button>
              <button onClick={() => setIsDialogOpen(true)} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 flex items-center gap-2">
                <Plus className="h-4 w-4" /> Ajouter
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between"><p className="text-xs text-slate-500">Total</p><CalendarDays className="h-4 w-4 text-blue-500" /></div>
              <p className="text-2xl font-bold text-slate-900">{total}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between"><p className="text-xs text-slate-500">Récurrents</p><TrendingUp className="h-4 w-4 text-emerald-500" /></div>
              <p className="text-2xl font-bold text-slate-900">{recurringCount}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between"><p className="text-xs text-slate-500">À venir</p><Clock className="h-4 w-4 text-amber-500" /></div>
              <p className="text-2xl font-bold text-slate-900">{upcomingCount}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between"><p className="text-xs text-slate-500">Taux récurrence</p><RefreshCw className="h-4 w-4 text-indigo-500" /></div>
              <p className="text-2xl font-bold text-slate-900">{Math.round((recurringCount/total)*100)}%</p>
            </div>
          </div>

          {/* Filtres et vue */}
          <div className="mb-6 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="relative"><Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-9 w-48 rounded-md border border-slate-200 pl-8 pr-3 text-sm focus:border-blue-500" /></div>
              <select value={filterRecurring} onChange={(e) => setFilterRecurring(e.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-sm">
                <option value="all">Tous</option><option value="recurring">Récurrents</option><option value="once">Ponctuels</option>
              </select>
              <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="h-9 rounded-md border border-slate-200 px-2 text-sm">
                <option value="all">Tous les mois</option>
                {months.map((m, i) => <option key={i} value={i}>{format(m, 'MMMM', { locale: fr })}</option>)}
              </select>
            </div>
            <div className="flex gap-1 rounded-md border border-slate-200 bg-white p-1">
              <button onClick={() => setViewMode('table')} className={`rounded px-3 py-1 text-sm ${viewMode === 'table' ? 'bg-blue-100 text-blue-700' : 'text-slate-500'}`}><List className="h-4 w-4 inline mr-1" />Table</button>
              <button onClick={() => setViewMode('calendar')} className={`rounded px-3 py-1 text-sm ${viewMode === 'calendar' ? 'bg-blue-100 text-blue-700' : 'text-slate-500'}`}><LayoutGrid className="h-4 w-4 inline mr-1" />Calendrier</button>
            </div>
          </div>

          {/* Statistiques (graphiques) */}
          {showStats && (
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><BarChart3 className="h-4 w-4" />Distribution mensuelle</h3>
                <div className="space-y-2">
                  {months.map((month, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs"><span className="w-12">{format(month, 'MMM', { locale: fr })}</span><div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(monthlyCount[idx]/maxCount)*100}%` }} /></div><span className="w-6 text-right">{monthlyCount[idx]}</span></div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><PieChart className="h-4 w-4" />Répartition par mois</h3>
                <div className="flex flex-wrap gap-2">
                  {pieData.map((item, i) => <span key={i} className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>{item.month}: {item.count}</span>)}
                </div>
              </div>
            </div>
          )}

          {/* Contenu principal: tableau ou calendrier */}
          <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr className="text-left text-xs font-medium text-slate-500 uppercase">
                      <th className="px-5 py-3">Nom</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Récurrence</th><th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedHolidays.map(holiday => (
                      <tr key={holiday.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium">{holiday.name}</td>
                        <td className="px-5 py-3 text-slate-600">{format(new Date(holiday.date), 'EEEE d MMMM yyyy', { locale: fr })}</td>
                        <td className="px-5 py-3">{holiday.isRecurring ? <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"><Check className="h-3 w-3" />Annuel</span> : <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"><X className="h-3 w-3" />Unique</span>}</td>
                        <td className="px-5 py-3 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(holiday)} className="p-1 text-slate-400 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button><button onClick={() => handleDelete(holiday.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div></td>
                      </tr>
                    ))}
                    {sortedHolidays.length === 0 && <tr><td colSpan={4} className="px-5 py-8 text-center text-slate-400">Aucune donnée</td></tr>}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth()-1)))}><ChevronLeft className="h-5 w-5" /></button>
                  <span className="font-semibold">{format(selectedDate, 'MMMM yyyy', { locale: fr })}</span>
                  <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth()+1)))}><ChevronRight className="h-5 w-5" /></button>
                </div>
                {renderCalendar()}
              </div>
            )}
          </div>
          <div className="mt-4 text-right text-xs text-slate-400">Dernière mise à jour : {format(new Date(), 'dd/MM/yyyy HH:mm')}</div>
        </div>
      </div>

      {/* Modal amélioré */}
      <AnimatePresence>{isDialogOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={(e) => e.target===e.currentTarget && setIsDialogOpen(false)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-md rounded-2xl bg-white shadow-xl"><div className="border-b p-5"><h3 className="text-lg font-semibold">{editingHoliday ? 'Modifier' : 'Ajouter'} un jour férié</h3></div><form onSubmit={handleSubmit} className="p-5 space-y-4"><div><label className="block text-sm font-medium">Nom</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" required /></div><div><label className="block text-sm font-medium">Date</label><input type="date" value={formData.date} onChange={e=>setFormData({...formData,date:e.target.value})} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2" required /></div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isRecurring} onChange={e=>setFormData({...formData,isRecurring:e.target.checked})} className="rounded" /> Récurrent chaque année</label><div className="flex gap-3 pt-4"><button type="button" onClick={()=>setIsDialogOpen(false)} className="flex-1 rounded-lg border border-slate-200 px-4 py-2">Annuler</button><button type="submit" className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white">{editingHoliday ? 'Modifier' : 'Ajouter'}</button></div></form></motion.div></motion.div>}</AnimatePresence>
    </DashboardLayout>
  );
};

export default Holidays;