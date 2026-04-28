import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  History, 
  Users, 
  ClipboardList,
  LogOut,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Tableau de bord', href: '/employerDashboard', icon: ClipboardList, roles: ['director'] },
  { label: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard, roles: ['employee', 'manager'] },
  { label: 'Nouvelle demande', href: '/request', icon: CalendarPlus, roles: ['employee', 'manager'] },
  { label: 'Mes congés', href: '/history', icon: History, roles: ['employee', 'manager'] },
  { label: 'Absences', href: '/absences', icon: Calendar, roles: ['employee', 'manager'] },
  { label: 'Gestion employés', href: '/employees', icon: Users, roles: ['director'] },
  { label: 'Jours fériés', href: '/holidays', icon: Calendar, roles: ['director'] },
  { label: 'Demandes à valider', href: '/pending', icon: ClipboardList, roles: ['manager', 'director'] },

];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <motion.aside

      className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground"
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Calendar className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">Gestion Congés</h1>
            <p className="text-xs text-sidebar-foreground/60">OFPPT Tanger</p>
          </div>
        </div>

        {/* User info */}
        <div className="border-b border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-accent text-sm font-medium">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60">
                {user.role === 'employee' ? 'Employé' : 
                 user.role === 'manager' ? 'Responsable' : 'Directeur'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-sidebar-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

