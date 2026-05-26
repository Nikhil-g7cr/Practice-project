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
    dispatch(
      fetchPhones({
        page: phonePage,
        limit: PRODUCTS_PER_PAGE,
      }),
    );
  }, [dispatch, phonePage]);

  useEffect(() => {
    dispatch(
      fetchLaptops({
        page: laptopPage,
        limit: PRODUCTS_PER_PAGE,
      }),
    );
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
    <div
      className="
        relative
        min-h-screen
        overflow-hidden

        bg-[url('/home.png')]
        bg-cover
        bg-center
        bg-no-repeat
        bg-fixed

        antialiased
        flex
        flex-col
        font-body
        text-base
      "
    >
      {/* Soft Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-white/[0.02]
        "
      />

      {/* Global Blur */}
      <div
        className="
          absolute
          inset-0
          backdrop-blur-[8px]
        "
      />

      {/* PLAYFUL LIQUID BLOBS */}

      {/* Cyan Blob */}
      <div
        className="
          absolute
          top-[-120px]
          left-[-120px]

          w-[420px]
          h-[420px]

          bg-cyan-300/25

          rounded-full
          blur-3xl

          animate-pulse
        "
      />

      {/* Purple Blob */}
      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]

          w-[420px]
          h-[420px]

          bg-purple-300/25

          rounded-full
          blur-3xl

          animate-pulse
        "
      />

      {/* Pink Blob */}
      <div
        className="
          absolute
          top-[35%]
          left-[40%]

          w-[280px]
          h-[280px]

          bg-pink-200/20

          rounded-full
          blur-3xl
        "
      />

      {/* MAIN CONTENT */}
      <div
        className="
          relative
          z-10

          flex
          flex-1

          w-full
          max-w-7xl

          mx-auto

          px-4
          md:px-16

          gap-6

          /* IMPORTANT FIX */
          pt-10
          pb-20
        "
      >
        <main
          className="
            flex-1
            w-full
            min-w-0
          "
        >
          {/* ADS CONTAINER */}
          {/* Added spacing so it does NOT collapse into topbar */}
          <div className="mt-25">
            <div
              className="
                relative
                overflow-hidden

                rounded-[2.5rem]
                h-auto
                bg-white/10
                backdrop-blur-[30px]

                border
                border-white/20

                before:absolute
                before:inset-0
                before:rounded-[2.5rem]
                before:p-[1px]
                before:bg-gradient-to-br
                before:from-white/60
                before:via-white/10
                before:to-cyan-200/20
                before:pointer-events-none

                after:absolute
                after:inset-[1px]
                after:rounded-[2.4rem]
                after:bg-white/[0.03]
                after:backdrop-blur-[50px]
                after:pointer-events-none

                shadow-[0_20px_60px_rgba(255,255,255,0.06)]
              "
            >
              {/* Reflection */}
              <div
                className="
                  absolute
                  inset-0

                  bg-gradient-to-br
                  from-white/20
                  via-transparent
                  to-white/5

                  pointer-events-none
                "
              />

              {/* Top Reflection */}
              <div
                className="
                  absolute
                  top-0
                  left-0
                  w-full
                  h-[35%]

                  bg-gradient-to-b
                  from-white/20
                  via-white/5
                  to-transparent

                  pointer-events-none
                "
              />

              <div className="relative z-10">
                <Ads />
              </div>
            </div>
          </div>

          {/* HEADER */}
          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:justify-between
              sm:items-end

              mb-10
              mt-12

              gap-4
            "
          >
            <div>
              <h2
                className="
                  font-headline
                  text-3xl
                  md:text-4xl
                  font-bold

                  tracking-tight

                  bg-gradient-to-r
                  from-slate-900
                  via-slate-700
                  to-slate-400

                  bg-clip-text
                  text-transparent
                "
              >
                Trending Devices
              </h2>

              <p
                className="
                  font-body
                  text-slate-600
                  mt-2
                "
              >
                Top picks for professionals and creators.
              </p>
            </div>

            {/* FILTER */}
            <div
              className="
                hidden
                sm:block

                relative
                overflow-hidden

                rounded-2xl

                bg-white/10
                backdrop-blur-2xl

                border
                border-white/20

                px-2
                py-2

                shadow-[0_8px_30px_rgba(255,255,255,0.05)]
              "
            >
              {/* Reflection */}
              <div
                className="
                  absolute
                  inset-0

                  bg-gradient-to-br
                  from-white/20
                  via-transparent
                  to-white/5
                "
              />

              <div className="relative z-10">
                <ProductFilter
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                />
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <div
            className="
              relative
              z-10
            "
          >
            <CardsContainer
              products={displayProducts}
              categoryFilter={categoryFilter}
            />
          </div>

          {/* PAGINATION */}
          <div
            className="
              mt-20
              flex
              justify-center
            "
          >
            {!isLoading && !hasError && displayProducts.length === 0 && (
              <div
                className="
                    flex
                    justify-center
                    items-center
                    py-20
                  "
              >
                <div
                  className="
                      px-8
                      py-5

                      rounded-[2rem]

                      bg-white/10
                      backdrop-blur-2xl

                      border
                      border-white/20

                      shadow-[0_8px_30px_rgba(255,255,255,0.06)]
                    "
                >
                  <h1
                    className="
                        text-slate-500
                        text-xl
                        font-medium
                      "
                  >
                    No {categoryFilter} found.
                  </h1>
                </div>
              </div>
            )}

            {!hasError &&
              activeMeta &&
              activeMeta.currentPage < activeMeta.totalPages && (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="
                    group
                    relative
                    overflow-hidden

                    px-8
                    py-4

                    rounded-full

                    text-sm
                    font-semibold

                    bg-white/12
                    backdrop-blur-2xl

                    border
                    border-white/20

                    text-slate-700

                    shadow-[0_8px_30px_rgba(255,255,255,0.06)]

                    transition-all
                    duration-300

                    hover:scale-105
                    hover:bg-white/18

                    disabled:opacity-50
                  "
                >
                  {/* Reflection */}
                  <div
                    className="
                      absolute
                      inset-0

                      bg-gradient-to-br
                      from-white/20
                      via-transparent
                      to-white/5
                    "
                  />

                  {/* Shine */}
                  <div
                    className="
                      absolute
                      top-0
                      left-[-130%]

                      w-[70%]
                      h-full

                      bg-gradient-to-r
                      from-transparent
                      via-white/30
                      to-transparent

                      skew-x-[-20deg]

                      transition-all
                      duration-[1200ms]

                      group-hover:left-[130%]
                    "
                  />

                  <span className="relative z-10">
                    {isLoading ? "Loading..." : "Load More"}
                  </span>
                </button>
              )}

            {!isLoading &&
              activeMeta &&
              activeMeta.currentPage >= activeMeta.totalPages &&
              displayProducts.length > 0 && (
                <p
                  className="
                    px-6
                    py-3

                    rounded-full

                    bg-white/12
                    backdrop-blur-2xl

                    border
                    border-white/20

                    shadow-[0_8px_30px_rgba(255,255,255,0.05)]

                    text-slate-600
                    font-medium
                  "
                >
                  You've reached the end!
                </p>
              )}

            {isLoading && activePage > 1 && (
              <p
                className="
                    text-slate-500
                    font-medium
                    mt-4
                    animate-pulse
                  "
              >
                Loading more...
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
