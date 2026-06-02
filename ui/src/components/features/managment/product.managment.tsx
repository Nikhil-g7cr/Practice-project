import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Popup from "../../../common/Popup";
import API from "../../../config/axios.config";
import { usePopup } from "../../../hooks/usePopup";
import type { Laptop } from "../../../redux/features/laptops/LaptopTypes";
import type { Phone } from "../../../redux/features/phones/PhoneTypes";

type ProductType = "phone" | "laptop";

interface CatalogProduct {
  id: string;
  type: ProductType;
  name: string;
  brand: string;
  price: number;
  stock: number;
  thumbnail?: string;
  isAvailable: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: unknown } } })
      .response;
    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Unable to load products right now.";
};

const mapPhone = (phone: Phone): CatalogProduct => ({
  id: phone._id,
  type: "phone",
  name: phone.name,
  brand: phone.brand,
  price: phone.basePrice,
  stock: phone.storageVariants.reduce(
    (total, variant) => total + Number(variant.stock || 0),
    0,
  ),
  thumbnail: phone.thumbnail,
  isAvailable: phone.isAvailable,
});

const mapLaptop = (laptop: Laptop): CatalogProduct => ({
  id: laptop._id,
  type: "laptop",
  name: laptop.modelName,
  brand: laptop.brand,
  price: laptop.discountPrice || laptop.price,
  stock: laptop.stock,
  thumbnail: laptop.thumbnail || laptop.images?.[0],
  isAvailable: laptop.isAvailable,
});

// --- NEW: Constant for pagination ---
const ITEMS_PER_PAGE = 10;

const ProductManagement = () => {
  const navigate = useNavigate();
  const { popupState, showError, showSuccess, showWarning, closePopup } =
    usePopup();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | ProductType>("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  // --- NEW: Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const [phonesResponse, laptopsResponse] = await Promise.all([
        API.get<{ data: Phone[] }>("/phones", { params: { limit: 100 } }),
        API.get<{ data: Laptop[] }>("/laptops", { params: { limit: 100 } }),
      ]);

      setProducts([
        ...(phonesResponse.data.data ?? []).map(mapPhone),
        ...(laptopsResponse.data.data ?? []).map(mapLaptop),
      ]);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchProducts();
  }, []);

  // --- NEW: Reset to page 1 whenever filters or search change ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesType = typeFilter === "all" || product.type === typeFilter;
      const matchesQuery =
        !query ||
        [product.name, product.brand, product.type].some((field) =>
          field.toLowerCase().includes(query),
        );

      return matchesType && matchesQuery;
    });
  }, [products, searchTerm, typeFilter]);

  // --- NEW: Calculate pagination data ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAvailabilityChange = async (product: CatalogProduct) => {
    const previousProducts = products;
    const isAvailable = !product.isAvailable;
    const endpoint = product.type === "phone" ? "/phones" : "/laptops";

    setSavingId(product.id);
    setError(null);
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, isAvailable } : item,
      ),
    );

    try {
      await API.patch(`${endpoint}/${product.id}`, { isAvailable });
      showSuccess(
        "Product updated",
        `${product.name} is now ${isAvailable ? "available" : "hidden"}.`,
        "Updated",
      );
    } catch (availabilityError) {
      setProducts(previousProducts);
      const message = getErrorMessage(availabilityError);
      setError(message);
      showError("Update failed", message);
    } finally {
      setSavingId(null);
    }
  };

  const deleteProduct = async (product: CatalogProduct) => {
    const previousProducts = products;
    const endpoint = product.type === "phone" ? "/phones" : "/laptops";

    setSavingId(product.id);
    setError(null);
    setProducts((current) => current.filter((item) => item.id !== product.id));

    try {
      await API.delete(`${endpoint}/${product.id}`);
      showSuccess("Product deleted", `${product.name} was removed.`, "Deleted");
      
      // Handle edge case: deleting last item on the current page
      if (paginatedProducts.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (deleteError) {
      setProducts(previousProducts);
      const message = getErrorMessage(deleteError);
      setError(message);
      showError("Delete failed", message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = (product: CatalogProduct) => {
    showWarning(
      "Delete product",
      `Are you sure you want to delete ${product.name}? This action cannot be undone.`,
      () => void deleteProduct(product),
      "Confirm delete",
      true,     
      "delete"  
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-left text-slate-900 sm:px-6 lg:px-8">
      <Popup config={popupState} onClose={closePopup} />
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

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Inventory
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Product management
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage availability, stock visibility, and catalog records.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admin/add-phone"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Phone
            </Link>
            <Link
              to="/admin/add-laptop"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Laptop
            </Link>
          </div>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative block">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
              search
            </span>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>

          <div className="grid grid-cols-3 rounded-lg border border-slate-300 bg-white p-1 text-sm font-semibold text-slate-600">
            {(["all", "phone", "laptop"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`rounded-md px-4 py-2 capitalize transition ${
                  typeFilter === type
                    ? "bg-slate-950 text-white"
                    : "hover:bg-slate-100"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-center text-sm text-slate-500">
              Loading products...
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No products found.
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={`${product.type}-${product.id}`}
                className="grid gap-4 border-b border-slate-100 p-4 last:border-b-0 lg:grid-cols-[1.5fr_0.7fr_0.6fr_0.7fr_0.5fr] lg:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">
                        inventory_2
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs capitalize text-slate-500">
                      {product.brand} · {product.type}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  {currencyFormatter.format(product.price || 0)}
                </p>

                <p className="text-sm text-slate-600">
                  {product.stock} in stock
                </p>

                <button
                  type="button"
                  disabled={savingId === product.id}
                  onClick={() => void handleAvailabilityChange(product)}
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold transition disabled:opacity-60 ${
                    product.isAvailable
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {product.isAvailable ? "Available" : "Hidden"}
                </button>

                <div className="flex items-center justify-end gap-2">
                  {product.type === "phone" && (
                    <Link
                      to={`/phones/update/${product.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
                      aria-label={`Edit ${product.name}`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        edit
                      </span>
                    </Link>
                  )}
                  <button
                    type="button"
                    disabled={savingId === product.id}
                    onClick={() => void handleDelete(product)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    aria-label={`Delete ${product.name}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- NEW: Pagination Controls UI --- */}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 sm:px-6 shadow-sm">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredProducts.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Previous</span>
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    const isCurrent = currentPage === pageNumber;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-slate-300 focus:z-20 focus:outline-offset-0 ${
                          isCurrent
                            ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            : "text-slate-900 hover:bg-slate-50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span className="sr-only">Next</span>
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductManagement;