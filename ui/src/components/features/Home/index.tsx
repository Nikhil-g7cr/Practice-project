import { useEffect, useState } from "react";
import "./Home.css";
import Ads from "./Ads.container";
import CardsContainer from "./CardsContainer";
import ProductFilter from "../../../constants/ProductFilter";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks/reduxHooks";
import { fetchPhones } from "../../../redux/features/phones/PhoneSlice";
import { fetchLaptops } from "../../../redux/features/laptops/LaptopSlice";

const PRODUCTS_PER_PAGE = 8;
type CategoryFilter = "smartphones" | "laptops";

export default function Home() {
  const dispatch = useAppDispatch();

  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("smartphones");
  const [phonePage, setPhonePage] = useState(1);
  const [laptopPage, setLaptopPage] = useState(1);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const {
    phones,
    meta: phoneMeta,
    loading: phoneLoading,
    error: phoneError,
  } = useAppSelector((state) => state.phones);
  const {
    laptops,
    meta: laptopMeta,
    loading: laptopLoading,
    error: laptopError,
  } = useAppSelector((state) => state.laptops);

  

  useEffect(() => {
    dispatch(fetchPhones({ page: phonePage, limit: PRODUCTS_PER_PAGE }));
  }, [dispatch, phonePage]);

  useEffect(() => {
    dispatch(fetchLaptops({ page: laptopPage, limit: PRODUCTS_PER_PAGE }));
  }, [dispatch, laptopPage]);

  const displayProducts =
    categoryFilter === "smartphones" ? phones || [] : laptops || [];

  useEffect(() => {
    if (displayProducts && displayProducts.length > 0) {
      setCurrentProduct(displayProducts[0]);
    }
  }, [displayProducts, categoryFilter]);

  const handleCurrentProduct = (product: any) => {
    setCurrentProduct(product);
  };

  const handleLoadMore = () => {
    if (categoryFilter === "smartphones") {
      if (
        phoneLoading ||
        (phoneMeta && phoneMeta.currentPage >= phoneMeta.totalPages)
      )
        return;
      setPhonePage((prevPage) => prevPage + 1);
    } else {
      if (
        laptopLoading ||
        (laptopMeta && laptopMeta.currentPage >= laptopMeta.totalPages)
      )
        return;
      setLaptopPage((prevPage) => prevPage + 1);
    }
  };

  const isLoading =
    categoryFilter === "smartphones" ? phoneLoading : laptopLoading;
  const hasError = categoryFilter === "smartphones" ? phoneError : laptopError;
  const activeMeta = categoryFilter === "smartphones" ? phoneMeta : laptopMeta;
  const activePage = categoryFilter === "smartphones" ? phonePage : laptopPage;

  return (
    // 1. The Apple-style soft gradient background
    <div className="antialiased min-h-screen flex flex-col font-body text-base relative overflow-hidden">
      {/* Optional: Add abstract floating colorful blobs here if you want extra blur effects */}

      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 gap-6 py-20 relative z-10">
        <main className="flex-1 w-full min-w-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-300/30 rounded-full blur-3xl"></div>

          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl"></div>

          <Ads />

          {/* Trending / New Arrivals Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
            <div>
              <h2 className="font-headline text-3xl font-bold text-slate-800 tracking-tight">
                Trending Devices
              </h2>
              <p className="font-body text-slate-500 mt-1">
                Top picks for professionals and creators.
              </p>
            </div>

            <div className="hidden sm:block">
              <ProductFilter
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
              />
            </div>
          </div>

          {/* Product Grid */}
          <CardsContainer
            products={displayProducts}
            categoryFilter={categoryFilter}
          />

          {/* Load More & Pagination States */}
          <div className="mt-20 flex justify-center">
            {!isLoading && !hasError && displayProducts.length === 0 && (
              <div className="flex justify-center items-center py-20">
                <h1 className="text-slate-400 text-xl font-medium">
                  No {categoryFilter} found.
                </h1>
              </div>
            )}

            {!hasError &&
              activeMeta &&
              activeMeta.currentPage < activeMeta.totalPages && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  // 2. The Glass Button
                  className="px-8 py-3 rounded-full text-sm font-semibold transition-all bg-white/60 backdrop-blur-md text-slate-700 border border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] hover:bg-white/80 disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              )}

            {!isLoading &&
              activeMeta &&
              activeMeta.currentPage >= activeMeta.totalPages &&
              displayProducts.length > 0 && (
                <p className="text-slate-500 font-medium bg-white/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/50 shadow-sm">
                  You've reached the end!
                </p>
              )}

            {isLoading && activePage > 1 && (
              <p className="text-slate-500 font-medium mt-4 animate-pulse">
                Loading more...
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
