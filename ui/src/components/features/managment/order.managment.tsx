const orderMetrics = [
  { label: "New orders", value: "24", color: "bg-indigo-500" },
  { label: "Processing", value: "12", color: "bg-amber-500" },
  { label: "Completed", value: "186", color: "bg-emerald-500" },
];

const sampleOrders = [
  {
    id: "ORD-1048",
    customer: "Aarav Sharma",
    status: "Processing",
    total: "Rs. 68,999",
  },
  {
    id: "ORD-1047",
    customer: "Meera Kapoor",
    status: "Packed",
    total: "Rs. 42,499",
  },
  {
    id: "ORD-1046",
    customer: "Rohan Verma",
    status: "Delivered",
    total: "Rs. 1,12,999",
  },
];

const OrderManagement = () => {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-8 text-left text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Fulfilment
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
            Order management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            The order API is not present in this backend yet, so this page is
            ready with the operational layout and sample rows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {orderMetrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className={`mb-4 h-2 w-12 rounded-full ${metric.color}`} />
              <p className="text-sm font-medium text-slate-500">
                {metric.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {sampleOrders.map((order) => (
            <div
              key={order.id}
              className="grid gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 md:grid-cols-[0.8fr_1.2fr_0.8fr_0.6fr] md:items-center"
            >
              <p className="text-sm font-bold text-slate-950">{order.id}</p>
              <p className="text-sm text-slate-600">{order.customer}</p>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {order.status}
              </span>
              <p className="text-sm font-semibold text-slate-800 md:text-right">
                {order.total}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default OrderManagement;
