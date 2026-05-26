import React from "react";

type CategoryFilter = "smartphones" | "laptops";

interface ProductFilterProps {
  categoryFilter: CategoryFilter;
  setCategoryFilter: (category: CategoryFilter) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ categoryFilter, setCategoryFilter }) => {
  return (
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
  );
};

export default ProductFilter;