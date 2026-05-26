import React from "react";
import ProductCard from "./ProductCard";

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

interface CardsContainerProps {
  products: (Phone | Laptop)[];
  categoryFilter: CategoryFilter;
}

const CardsContainer: React.FC<CardsContainerProps> = ({
  products,
  categoryFilter,
}) => {
  const handleAddToCart = (productId: string) => {
    console.log("Added to cart:", productId);
    // TODO: Implement add to cart functionality
  };

  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96 w-full">
        <p className="text-on-surface-variant font-body">
          No {categoryFilter} available
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="CardsContainer">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {" "}
          {products.map((product) => {
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
