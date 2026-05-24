import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Plus, Trash2, Edit2, Check, X, 
  TrendingUp, CalendarDays, Clock, Search, Filter, Download, 
  BarChart3, PieChart, ChevronLeft, ChevronRight, FileText, 
  Moon, Sun, LayoutGrid, List, RefreshCw, Eye, EyeOff, Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useData } from '@/contexts/DataContext';
import toast from "react-hot-toast";

const Holidays = () => {
  const { removeHoliday, addHoliday, updateHoliday, holidays } = useData();
  const [initialHolidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRecurring, setFilterRecurring] = useState('all'); 
  const [filterMonth, setFilterMonth] = useState('all');
  const [viewMode, setViewMode] = useState('table'); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [formData, setFormData] = useState({ name: '', type: '', date: '', is_recurring: true });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (holidays) {
      setHolidays(holidays);
      setLoading(false);
      setIsRefreshing(false);
    } else if (holidays === null) {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [holidays]);

  const currentYear = new Date().getFullYear();
  const months = eachMonthOfInterval({ start: new Date(currentYear, 0, 1), end: new Date(currentYear, 11, 31) });

  const filteredHolidays = useMemo(() => {
    return initialHolidays.filter(h => {
      const matchSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRecurring = filterRecurring === 'all' ? true : (filterRecurring === 'recurring' ? h.is_recurring : !h.is_recurring);
      const matchMonth = filterMonth === 'all' ? true : isSameMonth(new Date(h.date), new Date(currentYear, parseInt(filterMonth), 1));
      return matchSearch && matchRecurring && matchMonth;
    });
  }, [initialHolidays, searchTerm, filterRecurring, filterMonth, currentYear]);

  const sortedHolidays = [...filteredHolidays].sort((a, b) => new Date(a.date) - new Date(b.date));
  const totalPages = Math.ceil(sortedHolidays.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHolidays = sortedHolidays.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRecurring, filterMonth]);

  const total = initialHolidays.length;
  const recurringCount = initialHolidays.filter(h => h.is_recurring).length;
  const upcomingCount = initialHolidays.filter(h => new Date(h.date) >= new Date()).length;
  const monthlyCount = months.map(month => initialHolidays.filter(h => isSameMonth(new Date(h.date), month)).length);
  const maxCount = Math.max(...monthlyCount, 1);
  const pieData = months.map((month, idx) => ({ month: format(month, 'MMM', { locale: fr }), count: monthlyCount[idx] })).filter(d => d.count > 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    setIsSubmitting(true);
    setIsRefreshing(true);
    try {
      if (editingHoliday) {
        await updateHoliday(editingHoliday.id, formData);
        toast.success(`${formData.name} a été mis à jour`);
      } else {
        await addHoliday(formData);
        toast.success(`${formData.name} a été ajouté au calendrier`);
      }
      setFormData({ name: '', date: '', is_recurring: true, type: '' });
      setEditingHoliday(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur");
      setIsRefreshing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({ name: holiday.name, date: holiday.date, is_recurring: holiday.is_recurring, type: holiday.type || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Voulez-vous vraiment supprimer ce jour férié ?")) return;
    setDeletingId(id);
    setIsRefreshing(true);
    try {
      const holiday = initialHolidays.find(h => h.id === id);
      await removeHoliday(id);
      toast.success(`${holiday?.name} a été retiré du calendrier`);
    } catch (error) {
      console.error(error);
      toast.error("Erreur suppression");
      setIsRefreshing(false);
    } finally {
      setDeletingId(null);
    }
  };

  const exportCSV = () => {
    const csv = [["Nom", "Type", "Date", "Récurrent"]];
    initialHolidays.forEach(h => csv.push([h.name, h.type, h.date, h.is_recurring ? "Oui" : "Non"]));
    const blob = new Blob([csv.map(row => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jours_feries.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => (
          <div key={d} className="p-1 sm:p-2 text-center text-[10px] sm:text-xs font-semibold text-slate-500">{d}</div>
        ))}
        {Array(start.getDay() === 0 ? 6 : start.getDay() - 1).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="p-1 sm:p-2" />
        ))}
        {days.map(day => {
          const holiday = initialHolidays.find(h => isSameDay(new Date(h.date), day));
          return (
            <div key={day.toString()} className={`p-1 sm:p-2 text-center rounded-lg ${holiday ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50'}`}>
              <div className="text-xs sm:text-sm">{format(day, 'd')}</div>
              {holiday && <div className="text-[8px] sm:text-[10px] truncate max-w-full">{holiday.name}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  const HolidaysSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="h-7 sm:h-8 w-40 sm:w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-56 sm:w-64 bg-slate-100 rounded mt-2"></div>
        </div>
        <div className="h-10 w-28 bg-slate-200 rounded-md"></div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-slate-200 rounded-lg"></div>
              <div className="h-3 w-10 sm:w-12 bg-slate-200 rounded"></div>
            </div>
            <div className="h-6 sm:h-8 w-12 sm:w-16 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-10 w-full sm:w-52 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-full sm:w-32 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-full sm:w-40 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 bg-slate-200 rounded-lg"></div>
          <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
      <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-4 py-2 sm:px-6 sm:py-3"><div className="h-4 w-12 sm:w-16 bg-slate-200 rounded"></div></th>
                <th className="px-4 py-2 sm:px-6 sm:py-3"><div className="h-4 w-12 sm:w-16 bg-slate-200 rounded"></div></th>
                <th className="px-4 py-2 sm:px-6 sm:py-3"><div className="h-4 w-10 sm:w-12 bg-slate-200 rounded"></div></th>
                <th className="px-4 py-2 sm:px-6 sm:py-3"><div className="h-4 w-16 sm:w-20 bg-slate-200 rounded"></div></th>
                <th className="px-4 py-2 sm:px-6 sm:py-3 text-right"><div className="h-4 w-10 sm:w-12 bg-slate-200 rounded ml-auto"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[...Array(5)].map((_, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 sm:px-6 sm:py-4"><div className="h-5 w-24 sm:w-32 bg-slate-200 rounded"></div></td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4"><div className="h-5 w-20 sm:w-28 bg-slate-200 rounded"></div></td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4"><div className="h-6 w-14 sm:w-16 bg-slate-200 rounded-full"></div></td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4"><div className="h-6 w-16 sm:w-20 bg-slate-200 rounded-full"></div></td>
                  <td className="px-4 py-2 sm:px-6 sm:py-4 text-right"><div className="flex justify-end gap-2"><div className="h-7 w-7 sm:h-8 sm:w-8 bg-slate-200 rounded"></div><div className="h-7 w-7 sm:h-8 sm:w-8 bg-slate-200 rounded"></div></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="px-2 sm:px-4">
        {loading ? (
          <HolidaysSkeleton />
        ) : (
          <>
            {/* En-tête responsive */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  📅 Jours fériés
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Tableau de bord exécutif • Année {currentYear}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-md bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium border border-gray-300 hover:bg-gray-200 transition"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Ajouter
                </button>
              </div>
            </div>

            {/* KPIs responsives */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              <div className="group rounded-xl sm:rounded-2xl bg-white/80 p-3 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 text-blue-600">
                    <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500">Total</p>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-slate-900">{total}</p>
              </div>
              <div className="group rounded-xl sm:rounded-2xl bg-white/80 p-3 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-100 text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500">Récurrents</p>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-slate-900">{recurringCount}</p>
              </div>
              <div className="group rounded-xl sm:rounded-2xl bg-white/80 p-3 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-amber-100 text-amber-600">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500">À venir</p>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-slate-900">{upcomingCount}</p>
              </div>
              <div className="group rounded-xl sm:rounded-2xl bg-white/80 p-3 sm:p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-100 text-indigo-600">
                    <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500">Taux récurrence</p>
                </div>
                <p className="text-xl sm:text-3xl font-bold text-slate-900">
                  {total > 0 ? Math.round((recurringCount / total) * 100) : 0}%
                </p>
              </div>
            </div>

            {/* Filtres responsives */}
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 sm:h-10 w-full sm:w-52 rounded-xl border border-slate-200 bg-white/80 pl-8 sm:pl-9 pr-3 text-xs sm:text-sm shadow-sm focus:border-blue-500 focus:ring-2 outline-none"
                  />
                </div>
                <select
                  value={filterRecurring}
                  onChange={(e) => setFilterRecurring(e.target.value)}
                  className="h-9 sm:h-10 rounded-xl border border-slate-200 bg-white/80 px-2 sm:px-3 text-xs sm:text-sm shadow-sm focus:border-blue-500 outline-none"
                >
                  <option value="all">Tous</option>
                  <option value="recurring">Récurrents</option>
                  <option value="once">Ponctuels</option>
                </select>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="h-9 sm:h-10 rounded-xl border border-slate-200 bg-white/80 px-2 sm:px-3 text-xs sm:text-sm shadow-sm focus:border-blue-500 outline-none"
                >
                  <option value="all">Tous les mois</option>
                  {months.map((m, i) => (
                    <option key={i} value={i}>
                      {format(m, 'MMMM', { locale: fr })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white/80 p-0.5 sm:p-1 shadow-sm self-start md:self-auto">
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium transition ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <List className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Table</span>
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium transition ${
                    viewMode === 'calendar'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Calendrier</span>
                </button>
              </div>
            </div>

            {/* Contenu principal avec overlay de rafraîchissement */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden relative">
              {isRefreshing && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600" />
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">Mise à jour...</p>
                  </div>
                </div>
              )}

              {viewMode === 'table' ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="bg-slate-50/80 border-b border-slate-200 sticky top-0 z-10">
                        <tr className="text-left font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="px-3 py-2 sm:px-6 sm:py-3">Nom</th>
                          <th className="px-3 py-2 sm:px-6 sm:py-3">Date</th>
                          <th className="px-3 py-2 sm:px-6 sm:py-3">Type</th>
                          <th className="px-3 py-2 sm:px-6 sm:py-3">Récurrence</th>
                          <th className="px-3 py-2 sm:px-6 sm:py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedHolidays.map((holiday) => (
                          <tr key={holiday.id} className="group hover:bg-slate-50/70 transition">
                            <td className="px-3 py-2 sm:px-6 sm:py-4 font-medium text-slate-800 truncate max-w-[120px] sm:max-w-none">
                              {holiday.name}
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 text-slate-500 whitespace-nowrap sm:whitespace-normal">
                              {format(new Date(holiday.date), 'EEEE d MMMM yyyy', { locale: fr })}
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4">
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-emerald-700">
                                {holiday.type || 'Autre'}
                              </span>
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4">
                              {holiday.is_recurring ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-blue-700">
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  Annuel
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium text-slate-600">
                                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  Unique
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 sm:px-6 sm:py-4 text-right">
                              <div className="flex justify-end gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                                <button
                                  onClick={() => handleEdit(holiday)}
                                  disabled={deletingId === holiday.id || isRefreshing}
                                  className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition disabled:opacity-50"
                                >
                                  <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(holiday.id)}
                                  disabled={deletingId === holiday.id || isRefreshing}
                                  className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition disabled:opacity-50"
                                >
                                  {deletingId === holiday.id ? (
                                    <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {paginatedHolidays.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-3 py-8 sm:px-6 sm:py-10 text-center">
                              <p className="text-slate-400 text-xs sm:text-sm">Aucune donnée</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination responsive */}
                  {sortedHolidays.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-3 sm:p-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-muted-foreground">Lignes :</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="h-7 sm:h-8 rounded-md border border-slate-200 bg-white px-1 sm:px-2 text-xs sm:text-sm"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                          <option value="50">50</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1 || isRefreshing}
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium disabled:opacity-50"
                        >
                          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
                          <span className="hidden sm:inline">Précédent</span>
                        </button>
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                disabled={isRefreshing}
                                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-md text-xs sm:text-sm ${
                                  currentPage === pageNum
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages || isRefreshing}
                          className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium disabled:opacity-50"
                        >
                          <span className="hidden sm:inline">Suivant</span>
                          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-0 sm:ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 sm:p-5 rounded-2xl bg-white/80 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-slate-600"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <h2 className="text-sm sm:text-base font-semibold text-slate-800 capitalize">
                      {format(selectedDate, 'MMMM yyyy', { locale: fr })}
                    </h2>
                    <button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                      className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 text-slate-600"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-100 p-2 sm:p-3 bg-slate-50/50">
                    {renderCalendar()}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-right text-[10px] sm:text-xs text-slate-400">
              Dernière mise à jour : {format(new Date(), 'dd/MM/yyyy HH:mm')}
            </div>
          </>
        )}
      </div>

      {/* Modal responsive */}
      <AnimatePresence>
        {isDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && !isSubmitting && setIsDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-2xl bg-white shadow-xl mx-4"
            >
              <div className="border-b p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold">
                  {editingHoliday ? 'Modifier' : 'Ajouter'} un jour férié
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium">Nom</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-1.5 sm:py-2 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 sm:py-2 text-sm"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Choisir un type</option>
                    <option value="national">National</option>
                    <option value="religieux">Religieux</option>
                    <option value="entreprise">Entreprise</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 sm:py-2 text-sm"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={formData.is_recurring}
                    onChange={e => setFormData({ ...formData, is_recurring: e.target.checked })}
                    className="rounded"
                    disabled={isSubmitting}
                  />
                  Récurrent chaque année
                </label>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg border border-slate-200 px-4 py-1.5 sm:py-2 text-sm disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-1.5 sm:py-2 text-sm text-white disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />}
                    {editingHoliday ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Holidays;