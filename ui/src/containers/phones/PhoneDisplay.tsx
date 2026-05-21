import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { fetchPhones } from "../../redux/features/phones/PhoneSlice";
import type { Phone } from "../../redux/features/phones/PhoneTypes";
import { useNavigate } from "react-router-dom";

const PHONES_PER_PAGE = 8;

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

export default function PhoneDisplay() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { phones, meta, loading, error } = useAppSelector((state) => state.phones);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPhones({ page, limit: PHONES_PER_PAGE }));
  }, [dispatch, page]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customCSS;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleSelectedPhone = (phone: Phone) => {
    console.log("Selected phone:", phone);
    navigate(`/phone/${phone._id}`);
  };

  const handleLoadMore = () => {
    if (loading || (meta && meta.currentPage >= meta.totalPages)) {
      return;
    }

    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="antialiased min-h-screen flex flex-col">
      {/* MAIN LAYOUT */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 gap-6 py-20">
        
        {/* SIDEBAR */}
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

        {/* MAIN CONTENT */}
        <main className="flex-1 w-full min-w-0">
          
          {/* HERO */}
          <section className="w-full bg-white rounded-[2rem] overflow-hidden mb-20 relative shadow-sm">
            <div className="absolute inset-0 z-0">
              <img
                alt="Hero"
                className="w-full h-full object-cover opacity-70"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_eR8uPMv6ulVz7gPmbKJPVv8VDNv_aBOz3nJVgBBaElUpPnSWpgQgf9i0eMfaP33MBmE9hli3R_CSLi2deX3gfMMR6fK4Ud0CWFkJQa1l8e8zT_rvFUs8Yih9hRHfFI96Oqg22LDJd3XJX52cTFiQRfgrYROP6U9XauxOnrw7BHBRbj8ELEZGCvTLaEWaQbjvV0mEGaQjVv4TEfkYseRvTT37BARcBXtKBNOsQa3K6KVnagkHZkP9qj5yZVrCGGvtmkHQh18tA668"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            </div>

            <div className="relative z-10 p-12 md:p-20 flex flex-col justify-center h-[400px] max-w-2xl">
              <span className="inline-block px-4 py-1 bg-green-100 text-[#4a7c59] text-xs font-semibold uppercase tracking-wider rounded-full w-max mb-3">
                NEW ARRIVAL
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">
                The Next-Gen Experience.
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-lg">
                Discover the best premium smartphones built for creators and professionals.
              </p>
              <button className="btn-primary px-6 py-3 rounded-xl font-semibold w-max">
                Shop Now
              </button>
            </div>
          </section>

          {/* HEADER */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-semibold">Trending Devices</h2>
              <p className="text-sm text-gray-500">
                Top picks for professionals and creators.
              </p>
            </div>
          </div>

          {/* LOADING */}
          {loading && page === 1 && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-2xl font-bold">Loading Phones...</h1>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="flex justify-center items-center py-20">
              <h1 className="text-red-500 text-xl">{error}</h1>
            </div>
          )}

          {/* PRODUCT GRID */}
          {!error && phones.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {phones.map((phone) => (
                <article
                  onClick={() => handleSelectedPhone(phone)}
                  key={phone._id}
                  className="bg-white rounded-2xl shadow-sm p-3 flex flex-col product-card relative cursor-pointer"
                >
                  {/* FEATURED BADGE */}
                  {phone.isFeatured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-[#4a7c59] text-white text-[10px] font-semibold rounded-full uppercase tracking-wider">
                        Featured
                      </span>
                    </div>
                  )}

                  {/* IMAGE */}
                  <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                    <img
                      alt={phone.name}
                      className="max-h-full object-contain"
                      src={phone.thumbnail}
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 flex flex-col p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      SMARTPHONE
                    </p>

                    <h3 className="text-[16px] leading-[24px] font-semibold text-black line-clamp-1">
                      {phone.name}
                    </h3>

                    {/* RATING */}
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-[12px] text-gray-500">
                        {phone.rating} ({phone.reviewsCount})
                      </span>
                    </div>

                    {/* DYNAMIC COLORS */}
                    {phone.colors && phone.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        {phone.colors.map((color: Phone["colors"][number], index: number) => (
                          <div
                            key={index}
                            title={color.name}
                            className="w-4 h-4 rounded-full border border-gray-300 shadow-sm"
                            style={{ backgroundColor: color.hexCode }}
                          />
                        ))}
                      </div>
                    )}

                    {/* DYNAMIC PROCESSOR BADGE */}
                    {phone.specifications?.processor && (
                      <div className="mb-2">
                        <span className="text-[10px] font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 line-clamp-1">
                          💻 {phone.specifications.processor}
                        </span>
                      </div>
                    )}

                    {/* DYNAMIC STORAGE VARIANTS */}
                    {phone.storageVariants && phone.storageVariants.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {phone.storageVariants.map((variant: Phone["storageVariants"][number], index: number) => (
                          <span 
                            key={index} 
                            className="text-[10px] px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200"
                          >
                            {variant.storage} 
                          </span>
                        ))}
                      </div>
                    )}

                    {/* DESCRIPTION */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 mt-1">
                      {phone.description}
                    </p>

                    {/* PRICE & ADD TO CART */}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-[18px] text-black font-bold">
                        ${phone.basePrice}
                      </span>

                      <button 
                        onClick={(e) => {
                           e.stopPropagation();
                           console.log("Added to cart", phone.name);
                        }}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-[#4a7c59] hover:text-white transition-colors text-[#4a7c59]"
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* NO RESULTS MESSAGE */}
          {!loading && !error && phones.length === 0 && (
             <div className="flex justify-center items-center py-20">
              <h1 className="text-gray-500 text-xl font-semibold">No phones found.</h1>
            </div>
          )}

          {/* LOAD MORE BUTTON */}
          {!error && meta && meta.currentPage < meta.totalPages && (
            <div className="mt-20 flex justify-center">
              <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="btn-secondary px-6 py-2 rounded-xl font-semibold bg-white"
              >
                {loading ? "Loading more phones..." : "Load More Products"}
              </button>
            </div>
          )}

          {/* END OF LIST MESSAGE */}
          {!loading && meta && meta.currentPage >= meta.totalPages && phones.length > 0 && (
            <div className="mt-20 flex justify-center">
              <p className="text-gray-500 font-semibold">You've reached the end of the list!</p>
            </div>
          )}

          {/* LOADING INDICATOR FOR PAGINATION */}
          {loading && page > 1 && (
            <div className="mt-10 flex justify-center">
              <p className="text-gray-500 font-semibold">Loading more phones...</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
