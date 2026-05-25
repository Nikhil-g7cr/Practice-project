import { useEffect, useState } from "react";
import "./Home.css";
import { tailwindConfig } from "./tailwind.config";
// import Filter from "./Filter.container";
import Ads from "./Ads.container";
import CardsContainer from "./CardsContainer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/reduxHooks";
import { fetchPhones } from "../../../redux/features/phones/PhoneSlice";

const PRODUCTS_PER_PAGE = 8;

export default function Home() {
  useEffect(() => {
    // Inject Tailwind CDN script for utility classes used in the component
    const tailwindScript = document.createElement("script");
    tailwindScript.src =
      "https://cdn.tailwindcss.com?plugins=forms,container-queries";
    document.head.appendChild(tailwindScript);

    // Provide Tailwind config
    const configScript = document.createElement("script");
    configScript.innerHTML = `tailwind.config = ${JSON.stringify(tailwindConfig)};`;
    document.head.appendChild(configScript);

    return () => {
      if (document.head.contains(tailwindScript))
        document.head.removeChild(tailwindScript);
      if (document.head.contains(configScript))
        document.head.removeChild(configScript);
    };
  }, []);

  const [currentProduct, setCurrentProduct] = useState(null);

  const handleCurrentProduct = (product:any) => {
    setCurrentProduct(product);
  }


  const dispatch = useAppDispatch();
    const { phones, meta, loading, error } = useAppSelector(
      (state) => state.phones,
    );
  
    const [page, setPage] = useState(1);
  
    useEffect(() => {
      dispatch(fetchPhones({ page, limit: PRODUCTS_PER_PAGE }));
    }, [dispatch, page]);
  

  const handleLoadMore = () => {
    if (loading || (meta && meta.currentPage >= meta.totalPages)) {
      return;
    }

    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="antialiased min-h-screen flex flex-col font-body text-base">
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 gap-6 py-20">
        {/* SideNavBar */}
        {/* <Filter/> */}

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          {/* Hero Section */}
          <Ads/>

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
            <div className="hidden sm:flex gap-2">
              <span className="px-4 py-1 bg-surface-container text-on-surface font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-container-highest">
                Smartphones
              </span>
              <span className="px-4 py-1 bg-transparent text-on-surface-variant font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-container-highest">
                Laptops
              </span>
            </div>
          </div>

          {/* Product Grid */}
          <CardsContainer  handleCurrentProduct={handleCurrentProduct}/>

          <div className="mt-20 flex justify-center">
            {/* <button className="btn-secondary px-6 py-2 rounded-xl font-headline text-lg font-semibold bg-surface-container-lowest">
              Load More Products
            </button> */}
            {!loading && !error && phones.length === 0 && (
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
            phones.length > 0 && (
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
          </div>
        </main>
      </div>
    </div>
  );
}
