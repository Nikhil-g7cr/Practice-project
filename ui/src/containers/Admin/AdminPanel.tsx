import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/reduxHooks";
import { Roles } from "../../routes/Roles";

// Define the configuration for each panel, including who is allowed to see it.
const quickLinksConfig = [
  {
    title: "User Management",
    description: "Review customers, roles, and account access.",
    suffix: "/user", 
    icon: "group",
    allowedRoles: [Roles.ADMIN, Roles.DEVELOPER], // Managers CANNOT see this
  },
  {
    title: "Product Management",
    description: "Track phones, laptops, pricing, and inventory.",
    suffix: "/product",
    icon: "inventory_2",
    allowedRoles: [Roles.ADMIN, Roles.DEVELOPER, Roles.MANAGER], // Managers CAN see this
  },
  {
    title: "Order Management",
    description: "Monitor order activity and fulfilment status.",
    suffix: "/order",
    icon: "receipt_long",
    allowedRoles: [Roles.ADMIN, Roles.DEVELOPER, Roles.MANAGER], // Managers CAN see this
  },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  
  // Get the logged-in user from Redux
  const { user } = useAppSelector((state) => state.auth);

  // Fallback to a safe role if user isn't loaded yet
  const currentRole = user?.role || Roles.USER;
  
  // Get the correct URL prefix for this user (e.g., 'manager', 'dev', 'admin')
  const rolePrefix = Roles.getRolePrefix(currentRole);

  // Filter the links so only the ones the user is allowed to see are rendered
  const visibleLinks = quickLinksConfig.filter((link) =>
    link.allowedRoles.includes(currentRole)
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-left text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          Back
        </button>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl capitalize">
              {currentRole} Panel
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your assigned platform modules and metrics.
            </p>
          </div>
        </div>

        {/* --- DYNAMIC ROLE-BASED CARDS --- */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleLinks.map((link) => (
            <Link
              key={link.title}
              to={`/${rolePrefix}${link.suffix}`} // e.g. /manager/product
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                <span className="material-symbols-outlined text-[24px]">
                  {link.icon}
                </span>
              </div>
              <h2 className="mb-2 text-lg font-bold text-slate-900">
                {link.title}
              </h2>
              <p className="text-sm leading-relaxed text-slate-500">
                {link.description}
              </p>
              <div className="mt-6 flex items-center text-sm font-semibold text-indigo-600">
                Manage module
                <span className="material-symbols-outlined ml-1 text-[18px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Extra Panels Container */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Quick Actions
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                to="/laptops"
                className="rounded-lg bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                Review catalog
              </Link>
              <Link
                to={`/phone/1/gallery`}
                className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
              >
                Open media gallery
              </Link>
            </div>
          </section>

          {/* Analytics */}
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">Analytics</h2>
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Catalog readiness</span>
                  <span>86%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[86%] rounded-full bg-indigo-600" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Admin tasks</span>
                  <span>64%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[64%] rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default AdminPanel;