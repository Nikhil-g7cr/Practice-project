import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../redux/hooks/reduxHooks";
import ProductCard from "./ProductCard";
import { fetchLaptops } from "../../../redux/features/laptops/LaptopSlice";
import { fetchPhones } from "../../../redux/features/phones/PhoneSlice";

interface Phone {
  _id: string;
  name: string;
  basePrice: number;
  discountPrice?: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
  rating?: number;
  reviewsCount?: number;
  [key: string]: any;
}

interface Laptop {
  _id: string;
  modelName: string;
  price: number;
  discountPrice?: number;
  thumbnail?: string;
  images?: string[];
  category?: string;
  rating?: number;
  totalReviews?: number;
  [key: string]: any;
}

type CategoryFilter = "smartphones" | "laptops";

const CardsContainer = ({handleCurrentProduct}: {handleCurrentProduct: (product: any) => void}) => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const productS_PER_PAGE = 8;

  useEffect(() => {
    dispatch(fetchLaptops({ page, limit: productS_PER_PAGE }));
    dispatch(fetchPhones({ page, limit: productS_PER_PAGE }));
  }, [dispatch, page]);

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("smartphones");


  const { phones } = useAppSelector((state) => state.phones);
  const { laptops } = useAppSelector((state) => state.laptops);

  const handleAddToCart = (productId: string) => {
    console.log("Added to cart:", productId);
    // TODO: Implement add to cart functionality
  };

  

  // Get products based on selected category
  const displayProducts = categoryFilter === "smartphones" ? phones || [] : laptops || [];
  handleCurrentProduct(displayProducts[0]);

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="w-full">
        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter("smartphones")}
              className={`px-4 py-1 font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer transition-all ${
                categoryFilter === "smartphones"
                  ? "bg-surface-container text-on-surface"
                  : "bg-transparent text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              Smartphones
            </button>
            <button
              onClick={() => setCategoryFilter("laptops")}
              className={`px-4 py-1 font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer transition-all ${
                categoryFilter === "laptops"
                  ? "bg-surface-container text-on-surface"
                  : "bg-transparent text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              Laptops
            </button>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex justify-center items-center min-h-96">
          <p className="text-on-surface-variant font-body">
            No {categoryFilter} available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setCategoryFilter("smartphones")}
            className={`px-4 py-1 font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer transition-all ${
              categoryFilter === "smartphones"
                ? "bg-surface-container text-on-surface"
                : "bg-transparent text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            Smartphones
          </button>
          <button
            onClick={() => setCategoryFilter("laptops")}
            className={`px-4 py-1 font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer transition-all ${
              categoryFilter === "laptops"
                ? "bg-surface-container text-on-surface"
                : "bg-transparent text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            Laptops
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="CardsContainer">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product: Phone | Laptop) => {
            // Map phone properties
            if (categoryFilter === "smartphones") {
              const phone = product as Phone;
              return (
                <ProductCard
                  key={phone._id}
                  id={phone._id}
                  name={phone.name}
                  price={phone.basePrice}
                  originalPrice={
                    phone.discountPrice ? phone.basePrice : undefined
                  }
                  image={phone.thumbnail || phone.images?.[0] || ""}
                  category={phone.category || "SMARTPHONE"}
                  rating={phone.rating || 4.5}
                  reviews={phone.reviewsCount || 0}
                  onAddToCart={handleAddToCart}
                  
                />
              );
            }

            // Map laptop properties
            const laptop = product as Laptop;
            return (
              <ProductCard
                key={laptop._id}
                id={laptop._id}
                name={laptop.modelName}
                price={laptop.price}
                originalPrice={laptop.discountPrice ? laptop.price : undefined}
                image={laptop.thumbnail || laptop.images?.[0] || ""}
                category={laptop.category || "LAPTOP"}
                rating={laptop.rating || 4.5}
                reviews={laptop.totalReviews || 0}
                onAddToCart={handleAddToCart}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CardsContainer;
