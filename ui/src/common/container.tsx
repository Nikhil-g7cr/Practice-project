import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks/reduxHooks";

const productS_PER_PAGE = 8;

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

interface productType {
  _id: string;
  modelName: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
  rating?: number;
  totalReviews?: number;
  currency?: string
}


const formatPrice = (product: productType) => {
  const price = product.discountPrice || product.price;
  const currency = product.currency || "USD";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
};

const getproductImage = (product: productType) =>
  product.thumbnail || product.images?.[0] || "/vite.svg";

export default function productDisplayScreen() {


    
  const dispatch = useAppDispatch();
  const { products, meta, loading, error } = useAppSelector(
    (state) => state.products,
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchproducts({ page, limit: productS_PER_PAGE }));
  }, [dispatch, page]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customCSS;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSelectedproduct = (product: product) => {
    console.log("Selected product:", product);
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
                alt="Premium products arranged on a modern workstation."
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
                Discover premium products for gaming, business, creators, and professional workflows.
              </p>
              <button className="btn-primary px-6 py-3 rounded-xl font-semibold w-max">
                Shop Now
              </button>
            </div>
          </section>

          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Trending products</h2>
              <p className="text-sm text-gray-500">
                Top picks for performance, portability, and productivity.
              </p>
            </div>
          </div>

          {loading && page === 1 && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-2xl font-bold">Loading products...</h1>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-red-500 text-xl">{error}</h1>
            </div>
          )}

          <button className="mb-6 btn-secondary px-4 py-2 rounded-xl font-semibold flex items-center gap-2">
            <Link to="/admin/add-product" className="flex items-center gap-2"> <span className="material-symbols-outlined text-sm">add</span> Add new product </Link>
          </button>

          {!error && products.length > 0 && (
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <article
                  onClick={() => handleSelectedproduct(product)}
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm p-3 flex flex-col product-card relative cursor-pointer"
                >
                  {product.category && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-[#4a7c59] text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                  )}

                  <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                    <img
                      alt={product.modelName}
                      className="max-h-full object-contain"
                      src={getproductImage(product)}
                    />
                  </div>

                  <div className="flex-1 flex flex-col p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      {product.brand}
                    </p>

                    <h3 className="text-[16px] leading-[24px] font-semibold text-black line-clamp-1">
                      {product.modelName}
                    </h3>

                    <div className="flex items-center gap-1 mt-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-[12px] text-gray-500">
                        {product.rating || 0} ({product.totalReviews || 0})
                      </span>
                    </div>

                    {product.color && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {product.color}
                        </span>
                      </div>
                    )}

                    {product.cpu?.processorModel && (
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 line-clamp-1">
                          {product.cpu.processorBrand} {product.cpu.processorModel}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.memory?.ramSize && (
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {product.memory.ramSize}GB {product.memory.ramType}
                        </span>
                      )}
                      {product.storage?.storageCapacity && (
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {product.storage.storageCapacity} {product.storage.storageType}
                        </span>
                      )}
                      {product.display?.size && (
                        <span className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                          {product.display.size}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 mt-1">
                      {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex flex-col">
                        <span className="text-[18px] text-black font-bold">
                          {formatPrice(product)}
                        </span>
                        {product.discountPrice > 0 && product.discountPrice < product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: product.currency || "USD",
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Added to cart", product.modelName);
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

          {!loading && !error && products.length === 0 && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-gray-500 text-xl font-semibold">
                No products found.
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
                {loading ? "Loading more products..." : "Load More Products"}
              </button>
            </div>
          )}

          {!loading &&
            meta &&
            meta.currentPage >= meta.totalPages &&
            products.length > 0 && (
              <div className="mt-20 flex justify-center">
                <p className="text-gray-500 font-semibold">
                  You've reached the end of the list!
                </p>
              </div>
            )}

          {loading && page > 1 && (
            <div className="mt-10 flex justify-center">
              <p className="text-gray-500 font-semibold">
                Loading more products...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
