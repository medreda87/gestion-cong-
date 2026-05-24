import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const DashboardLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view (screen < 768px)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-close drawer when resizing to desktop
  useEffect(() => {
    if (!isMobile && open) setOpen(false);
  }, [isMobile]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, open]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ----- DESKTOP LAYOUT (fixed sidebar) -----
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Fixed Sidebar - always visible on desktop */}
        <aside className="fixed left-0 top-0 z-30 h-full w-64 border-r bg-card shadow-sm">
          <Sidebar onClose={() => {}} /> {/* onClose not used on desktop */}
        </aside>

        {/* Main content - offset by sidebar width */}
        <main className="ml-64 min-h-screen overflow-x-hidden">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // ----- MOBILE LAYOUT (drawer + overlay) -----
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar with Hamburger */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background px-4 shadow-sm">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 hover:bg-muted transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Gestion Congés</h1>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-72 transform transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Main Content (mobile) */}
      <main className="min-h-screen overflow-x-hidden">
        <div className="container mx-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};