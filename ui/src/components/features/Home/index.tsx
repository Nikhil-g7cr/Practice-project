import { useEffect, useState } from "react";
import "./Home.css";
import { tailwindConfig } from "./tailwind.config";
import Ads from "./Ads.container";
import CardsContainer from "./CardsContainer";
import ProductFilter from "../../../constants/ProductFilter";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/reduxHooks";
import { fetchPhones } from "../../../redux/features/phones/PhoneSlice";
import { fetchLaptops } from "../../../redux/features/laptops/LaptopSlice";

const PRODUCTS_PER_PAGE = 8;
type CategoryFilter = "smartphones" | "laptops";

export default function Home() {
  const dispatch = useAppDispatch();
  
  // 1. Separate page state for each category
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("smartphones");
  const [phonePage, setPhonePage] = useState(1);
  const [laptopPage, setLaptopPage] = useState(1);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  // Redux Selectors for both categories
  const { phones, meta: phoneMeta, loading: phoneLoading, error: phoneError } = useAppSelector((state) => state.phones);
  const { laptops, meta: laptopMeta, loading: laptopLoading, error: laptopError } = useAppSelector((state) => state.laptops);

  useEffect(() => {
    const tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
    document.head.appendChild(tailwindScript);

    const configScript = document.createElement("script");
    configScript.innerHTML = `tailwind.config = ${JSON.stringify(tailwindConfig)};`;
    document.head.appendChild(configScript);

    return () => {
      if (document.head.contains(tailwindScript)) document.head.removeChild(tailwindScript);
      if (document.head.contains(configScript)) document.head.removeChild(configScript);
    };
  }, []);

  // 2. Separate useEffects to fetch data ONLY when their specific page changes
  useEffect(() => {
    dispatch(fetchPhones({ page: phonePage, limit: PRODUCTS_PER_PAGE }));
  }, [dispatch, phonePage]);

  useEffect(() => {
    dispatch(fetchLaptops({ page: laptopPage, limit: PRODUCTS_PER_PAGE }));
  }, [dispatch, laptopPage]);

  // Determine what to display based on selected filter
  const displayProducts = categoryFilter === "smartphones" ? (phones || []) : (laptops || []);

  // Update current product safely
  useEffect(() => {
    if (displayProducts && displayProducts.length > 0) {
      setCurrentProduct(displayProducts[0]);
    }
  }, [displayProducts, categoryFilter]);

  const handleCurrentProduct = (product: any) => {
    setCurrentProduct(product);
  };

  // 3. Update the correct page state based on the active category
  const handleLoadMore = () => {
    if (categoryFilter === "smartphones") {
      if (phoneLoading || (phoneMeta && phoneMeta.currentPage >= phoneMeta.totalPages)) return;
      setPhonePage((prevPage) => prevPage + 1);
    } else {
      if (laptopLoading || (laptopMeta && laptopMeta.currentPage >= laptopMeta.totalPages)) return;
      setLaptopPage((prevPage) => prevPage + 1);
    }
  };

  const isLoading = categoryFilter === "smartphones" ? phoneLoading : laptopLoading;
  const hasError = categoryFilter === "smartphones" ? phoneError : laptopError;
  const activeMeta = categoryFilter === "smartphones" ? phoneMeta : laptopMeta;
  const activePage = categoryFilter === "smartphones" ? phonePage : laptopPage;

  return (
    <div className="antialiased min-h-screen flex flex-col font-body text-base">
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 gap-6 py-20">
        <main className="flex-1 w-full min-w-0">
          
          <Ads />

          {/* Trending / New Arrivals Header */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-headline text-2xl font-semibold text-on-surface">
                Trending Devices
              </h2>
              <p className="font-body text-sm text-on-surface-variant">
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
                <h1 className="text-gray-500 text-xl font-semibold">
                  No {categoryFilter} found.
                </h1>
              </div>
            )}

            {!hasError && activeMeta && activeMeta.currentPage < activeMeta.totalPages && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="btn-secondary px-6 py-2 rounded-xl font-semibold bg-white border border-gray-200 shadow-sm"
              >
                {isLoading ? "Loading more products..." : "Load More Products"}
              </button>
            )}

            {!isLoading && activeMeta && activeMeta.currentPage >= activeMeta.totalPages && displayProducts.length > 0 && (
              <p className="text-gray-500 font-semibold">
                You've reached the end of the list!
              </p>
            )}

            {isLoading && activePage > 1 && (
              <p className="text-gray-500 font-semibold mt-4">
                Loading more products...
              </p>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}