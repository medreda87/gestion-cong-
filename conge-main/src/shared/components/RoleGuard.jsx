import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const RoleGuard = ({ children, roles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default RoleGuard;

