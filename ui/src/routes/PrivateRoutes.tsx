import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../redux/hooks/reduxHooks";
import { Roles } from "./Roles";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AccessDenied = () => (
  <div className="min-h-[60vh] flex items-center justify-center px-4">
    <div className="max-w-md text-center bg-white border border-red-100 rounded-xl p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Access denied</h1>
      <p className="text-gray-600">
        You must be an admin to add, update, or delete store resources.
      </p>
    </div>
  </div>
);

const PrivateRoute = ({
  children,
  allowedRoles = [Roles.ADMIN],
}: PrivateRouteProps) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
