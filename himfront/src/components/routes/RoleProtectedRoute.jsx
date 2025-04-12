import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { USER_STATUSES } from '../../constants/auth';

export const RoleProtectedRoute = ({ 
  children, 
  allowedRoles = [],
  requiredStatus = USER_STATUSES.ACTIVE
}) => {
  const { authData, isAuthenticated, isLoading } = useAuth();

  const ALLOWED_PATHS_FOR_INACTIVE = ["/", "/profile"];

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (
      authData.status !== requiredStatus &&
      !ALLOWED_PATHS_FOR_INACTIVE.includes(location.pathname)
  ) {
    // Перенаправляем на "/" (можно заменить на "/profile", если нужно)
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(authData.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};