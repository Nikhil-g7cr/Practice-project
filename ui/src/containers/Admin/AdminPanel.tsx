import { Link } from "react-router-dom";

const quickLinks = [
  {
    title: "User Management",
    description: "Review customers, roles, and account access.",
    href: "/admin/user",
    icon: "group",
  },
  {
    title: "Product Management",
    description: "Track phones, laptops, pricing, and inventory.",
    href: "/admin/product",
    icon: "inventory_2",
  },
  {
    title: "Order Management",
    description: "Monitor order activity and fulfilment status.",
    href: "/admin/order",
    icon: "receipt_long",
  },
];

const AdminPanel = () => {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-8 text-left text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Admin workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Store control center
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-600">
              Manage users, product catalog data, and store operations from one
              clean dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/add-phone"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add phone
            </Link>
            <Link
              to="/admin/add-laptop"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add laptop
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <span className="material-symbols-outlined text-[24px]">
                    {item.icon}
                  </span>
                </span>
                <span className="material-symbols-outlined text-[20px] text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600">
                  arrow_forward
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Website changes
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Use the product tools to keep storefront content fresh.
                </p>
              </div>
              <span className="material-symbols-outlined text-indigo-600">
                edit_square
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                to="/admin/product"
                className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
              >
                Review catalog
              </Link>
              <Link
                to="/gallery"
                className="rounded-lg bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-200"
              >
                Open media gallery
              </Link>
            </div>
          </section>

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
