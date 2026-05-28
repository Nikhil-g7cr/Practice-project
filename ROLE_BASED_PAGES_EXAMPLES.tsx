// Example file showing how to set up pages for different roles
// You can use these as templates for creating your actual pages

// Admin Pages Example
// =====================

// src/containers/Admin/AdminDashboard.tsx
export const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded">
          <h2>Total Users</h2>
          <p className="text-2xl">1,234</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h2>Total Orders</h2>
          <p className="text-2xl">567</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h2>Total Products</h2>
          <p className="text-2xl">890</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <h2>Pending Issues</h2>
          <p className="text-2xl">45</p>
        </div>
      </div>
    </div>
  );
};

// src/containers/Admin/AdminUsers.tsx
export const AdminUsers = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">User ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>{/* Add user rows here */}</tbody>
      </table>
    </div>
  );
};

// Tester Pages Example
// ====================

// src/containers/Tester/TestReports.tsx
export const TestReports = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Test Reports</h1>
      <div className="space-y-4">{/* Add test reports here */}</div>
    </div>
  );
};

// src/containers/Tester/BugTracker.tsx
export const BugTracker = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bug Tracker</h1>
      {/* Add bug list here */}
    </div>
  );
};

// Developer Pages Example
// =======================

// src/containers/Developer/ApiDocs.tsx
export const ApiDocs = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      {/* Add API docs here */}
    </div>
  );
};

// Manager Pages Example
// ====================

// src/containers/Manager/Analytics.tsx
export const Analytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      {/* Add analytics charts here */}
    </div>
  );
};

// Update Your Routes
// ==================

// src/routes/index.tsx
// Add these routes to your routing configuration:

export const roleBasedRoutes = [
  // Admin Routes
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    requiredRoles: ["admin"],
  },
  {
    path: "/admin/products",
    element: <AdminProducts />,
    requiredRoles: ["admin"],
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
    requiredRoles: ["admin"],
  },
  {
    path: "/admin/orders",
    element: <AdminOrders />,
    requiredRoles: ["admin"],
  },

  // Tester Routes
  {
    path: "/tester/reports",
    element: <TestReports />,
    requiredRoles: ["tester"],
  },
  {
    path: "/tester/bugs",
    element: <BugTracker />,
    requiredRoles: ["tester"],
  },
  {
    path: "/tester/test-cases",
    element: <TestCases />,
    requiredRoles: ["tester"],
  },

  // Developer Routes
  {
    path: "/developer/api-docs",
    element: <ApiDocs />,
    requiredRoles: ["developer"],
  },
  {
    path: "/developer/repo",
    element: <CodeRepository />,
    requiredRoles: ["developer"],
  },

  // Manager Routes
  {
    path: "/manager/analytics",
    element: <Analytics />,
    requiredRoles: ["manager"],
  },
  {
    path: "/manager/team",
    element: <TeamPerformance />,
    requiredRoles: ["manager"],
  },
];

// Protected Route Wrapper
// =======================

// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks/reduxHooks";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRoles: string[];
}

export const ProtectedRoute = ({
  children,
  requiredRoles,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role || "")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Usage in routes:
// <Route
//   path="/admin/dashboard"
//   element={
//     <ProtectedRoute requiredRoles={["admin"]}>
//       <AdminDashboard />
//     </ProtectedRoute>
//   }
// />
