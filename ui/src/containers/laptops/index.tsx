import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { fetchLaptops } from "../../redux/features/laptops/LaptopSlice";
import type { Laptop } from "../../redux/features/laptops/LaptopTypes";
import { Link } from "react-router-dom";

const LAPTOPS_PER_PAGE = 8;

const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Literata:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  body {
    background-color: #faf6f0;
    color: #2e3230;
    margin: 0;
    font-family: 'Nunito Sans', sans-serif;
  }

  .btn-primary {
    background-color: #4a7c59;
    color: white;
    transition: all 200ms ease-in-out;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    border: 1px solid #705c30;
    color: #705c30;
    transition: all 200ms ease-in-out;
  }

  .btn-secondary:hover {
    background-color: #f0ece4;
  }

  .product-card {
    transition: all 200ms ease-in-out;
  }

  .product-card:hover {
    transform: translateY(-4px);
  }

  .product-image-bg {
    background-color: #faf6f0;
  }
`;

const formatPrice = (laptop: Laptop) => {
  const price = laptop.discountPrice || laptop.price;
  const currency = laptop.currency || "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

const getLaptopImage = (laptop: Laptop) =>
  laptop.thumbnail || laptop.images?.[0] || "/vite.svg";

export default function LaptopDisplayScreen() {
  const dispatch = useAppDispatch();
  const { laptops, meta, loading, error } = useAppSelector(
    (state) => state.laptops,
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLaptops({ page, limit: LAPTOPS_PER_PAGE }));
  }, [dispatch, page]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customCSS;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSelectedLaptop = (laptop: Laptop) => {
    console.log("Selected laptop:", laptop);
  };

  const handleLoadMore = () => {
    if (loading || (meta && meta.currentPage >= meta.totalPages)) {
      return;
    }

    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="antialiased min-h-screen flex flex-col">
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 gap-6 py-20">
        <aside className="bg-white border-r border-gray-200 h-screen w-64 hidden lg:flex flex-col flex-shrink-0">
          <div className="flex flex-col gap-6 p-6 sticky top-24">
            <div>
              <h2 className="text-lg font-semibold">Filters</h2>
              <p className="text-sm text-gray-500">Refine your search</p>
            </div>

            <nav className="flex flex-col gap-3 mt-4">
              <button className="flex items-center gap-3 p-3 text-[#4a7c59] font-bold bg-green-50 rounded-xl">
                Categories
              </button>
              <button className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl">
                Price Range
              </button>
              <button className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-100 rounded-xl">
                Brands
              </button>
            </nav>

            <button className="mt-8 btn-primary px-4 py-2 rounded-xl font-semibold">
              Apply Filters
            </button>
          </div>
        </aside>

        <main className="flex-1 w-full min-w-0">
          <section className="w-full bg-white rounded-[2rem] overflow-hidden mb-20 relative shadow-sm">
            <div className="absolute inset-0 z-0">
              <img
                alt="Premium laptops arranged on a modern workstation."
                className="w-full h-full object-cover opacity-70"
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            </div>

            <div className="relative z-10 p-12 md:p-20 flex flex-col justify-center h-[400px] max-w-2xl">
              <span className="inline-block px-4 py-1 bg-green-100 text-[#4a7c59] text-xs font-semibold uppercase tracking-wider rounded-full w-max mb-3">
                NEW ARRIVAL
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                Performance Built For Work.
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-lg">
                Discover premium laptops for gaming, business, creators, and professional workflows.
              </p>
              <button className="btn-primary px-6 py-3 rounded-xl font-semibold w-max">
                Shop Now
              </button>
            </div>
          </section>

          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Trending Laptops</h2>
              <p className="text-sm text-gray-500">
                Top picks for performance, portability, and productivity.
              </p>
            </div>
          </div>

          {loading && page === 1 && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-2xl font-bold">Loading Laptops...</h1>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-red-500 text-xl">{error}</h1>
            </div>
          )}

          <button className="mb-6 btn-secondary px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
            <Link to="/admin/add-laptop" className="flex items-center gap-2"> <span className="material-symbols-outlined text-sm">add</span> Add new Laptop </Link>
          </button>

          {!error && laptops.length > 0 && (
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {laptops.map((laptop) => (
                <article
                  onClick={() => handleSelectedLaptop(laptop)}
                  key={laptop._id}
                  className="bg-white rounded-2xl shadow-sm p-3 flex flex-col product-card relative cursor-pointer"
                >
                  {laptop.category && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-[#4a7c59] text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                        {laptop.category}
                      </span>
                    </div>
                  )}

                  <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                    <img
                      alt={laptop.modelName}
                      className="max-h-full object-contain"
                      src={getLaptopImage(laptop)}
                    />
                  </div>

                  <div className="flex-1 flex flex-col p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      {laptop.brand}
                    </p>

                    <h3 className="text-[16px] leading-[24px] font-semibold text-black line-clamp-1">
                      {laptop.modelName}
                    </h3>

                    <div className="flex items-center gap-1 mt-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-[12px] text-gray-500">
                        {laptop.rating || 0} ({laptop.totalReviews || 0})
                      </span>
                    </div>

                    {laptop.color && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {laptop.color}
                        </span>
                      </div>
                    )}

                    {laptop.cpu?.processorModel && (
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 line-clamp-1">
                          {laptop.cpu.processorBrand} {laptop.cpu.processorModel}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      {laptop.memory?.ramSize && (
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {laptop.memory.ramSize}GB {laptop.memory.ramType}
                        </span>
                      )}
                      {laptop.storage?.storageCapacity && (
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {laptop.storage.storageCapacity} {laptop.storage.storageType}
                        </span>
                      )}
                      {laptop.display?.size && (
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {laptop.display.size}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 mt-1">
                      {laptop.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex flex-col">
                        <span className="text-[18px] text-black font-bold">
                          {formatPrice(laptop)}
                        </span>
                        {laptop.discountPrice > 0 && laptop.discountPrice < laptop.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: laptop.currency || "USD",
                              maximumFractionDigits: 0,
                            }).format(laptop.price)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Added to cart", laptop.modelName);
                        }}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-[#4a7c59] hover:text-white transition-colors text-[#4a7c59]"
                      >
                        <span className="material-symbols-outlined text-base">
                          shopping_cart
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && laptops.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-gray-500 text-xl font-semibold">
                No laptops found.
              </h1>
            </div>
          )}

          {!error && meta && meta.currentPage < meta.totalPages && (
            <div className="mt-20 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="btn-secondary px-6 py-2 rounded-xl font-semibold bg-white"
              >
                {loading ? "Loading more laptops..." : "Load More Products"}
              </button>
            </div>
          )}

          {!loading &&
            meta &&
            meta.currentPage >= meta.totalPages &&
            laptops.length > 0 && (
              <div className="mt-20 flex justify-center">
                <p className="text-gray-500 font-semibold">
                  You've reached the end of the list!
                </p>
              </div>
            )}

          {loading && page > 1 && (
            <div className="mt-10 flex justify-center">
              <p className="text-gray-500 font-semibold">
                Loading more laptops...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
