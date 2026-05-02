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
import EmployeeDashboard from "./directeur/pages/employerDashboard";
import { DataProvider } from "./contexts/DataContext";
import { Navigate } from "react-router-dom";
import Setting from './directeur/pages/paramettre'
import DetailDemande from '@/directeur/pages/DetailDemande';
import DocumentsDirecteur from "./directeur/pages/DocumentsDirecteur";
import EmployeeDocuments from "./pages/DocumentEmploye";
import { Toaster } from "react-hot-toast";  
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BalanceProvider>
        <DataProvider>
        <LeaveProvider>
          <BrowserRouter>
<Toaster
  position="top-right"  // better for mobile & general UX
  reverseOrder={true}       // newer toasts on top (or bottom, pick one)
  toastOptions={{
    duration: 3000,         // shorter, less intrusive
    style: {
      background: 'var(--toast-bg, #1a1a1a)',
      color: 'var(--toast-text, #fff)',
      borderRadius: '8px',
      padding: '12px 20px',
    },
  }}
/>
          <Routes>
           <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/request" element={<LeaveRequest />} />
            <Route path="/employerDashboard" element={<EmployeeDashboard />} />
            <Route path="/documents" element={<DocumentsDirecteur/>}/>
            <Route path="/documentEmploye" element={<EmployeeDocuments/>}/>
            <Route path='/paramettre' element={<Setting/>}/>
            <Route path="/history" element={<LeaveHistory />} />
            <Route path="/pramettre" element={<Setting/>} />
            <Route path="/pending" element={
              <RoleGuard roles={['manager']}>
                <PendingRequestsResponsable />
              </RoleGuard>
            } />

            <Route path="/pending-director" element={
              <RoleGuard roles={['directeur']}>
                <PendingRequestsDirecteur />
              </RoleGuard>
            } />
            <Route path="/employees" element={
              <RoleGuard roles={['directeur']}>
                <Employees />
              </RoleGuard>
            } />
            <Route path="/holidays" element={
              <RoleGuard roles={['directeur']}>
                <Holidays />
              </RoleGuard>
            } />
            <Route path="/absences" element={<Absences />} />
            <Route path="/demande/:id" element={<DetailDemande />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </LeaveProvider>
        </DataProvider>
      </BalanceProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
