import { Link, Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../redux/hooks/reduxHooks"; // Adjust path if needed

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const AccessDenied = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 mt-10">
    <div className="w-full max-w-2xl rounded-2xl border border-red-100 bg-white p-10 shadow-lg mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Access Denied</h1>
          <p className="mt-2 text-gray-600 leading-relaxed">
            You do not have the required permissions to view this page.
          </p>
        </div>
      </div>
      <div className="flex justify-end">
        <Link
          to="/"
          className="rounded-xl bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  </div>
);

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // 1. If no user is logged in, redirect to login page
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If route requires specific roles, check if the user has access
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      return <AccessDenied />;
    }
  }

  // 3. If authenticated and authorized, render the component
  return <>{children}</>;
};

export default PrivateRoute;
