import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import { BalanceProvider } from "@/contexts/BalanceContext";
import RoleGuard from "@/shared/components/RoleGuard";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import LeaveRequest from "@/pages/LeaveRequest";
import LeaveHistory from "@/pages/LeaveHistory";
import Absences from "@/pages/Absences";
import NotFound from "@/pages/NotFound";
import PendingRequestsResponsable from "@/responsable/pages/PendingRequests";
import PendingRequestsDirecteur from "@/directeur/pages/PendingRequests";
import Employees from "@/directeur/pages/Employees";
import Holidays from "@/directeur/pages/Holidays";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BalanceProvider>
        <LeaveProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/request" element={<LeaveRequest />} />
            <Route path="/history" element={<LeaveHistory />} />
            <Route path="/pending" element={
              <RoleGuard roles={['manager']}>
                <PendingRequestsResponsable />
              </RoleGuard>
            } />
            <Route path="/pending-director" element={
              <RoleGuard roles={['director']}>
                <PendingRequestsDirecteur />
              </RoleGuard>
            } />
            <Route path="/employees" element={
              <RoleGuard roles={['director']}>
                <Employees />
              </RoleGuard>
            } />
            <Route path="/holidays" element={
              <RoleGuard roles={['director']}>
                <Holidays />
              </RoleGuard>
            } />
            <Route path="/absences" element={<Absences />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </LeaveProvider>
      </BalanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
