import React from "react";

type CategoryFilter = "smartphones" | "laptops";

interface ProductFilterProps {
  categoryFilter: CategoryFilter;
  setCategoryFilter: (category: CategoryFilter) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({ categoryFilter, setCategoryFilter }) => {
  return (
    // Wrapper for the filters to look like an Apple segmented control
    <div className="flex gap-2 p-1.5 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <button
        onClick={() => setCategoryFilter("smartphones")}
        className={`px-6 py-2 text-sm font-semibold tracking-wide rounded-full transition-all duration-300 ${
          categoryFilter === "smartphones"
            ? "bg-white text-slate-800 shadow-sm" // Active state pops up
            : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-white/30" // Inactive state
        }`}
      >
        Smartphones
      </button>
      <button
        onClick={() => setCategoryFilter("laptops")}
        className={`px-6 py-2 text-sm font-semibold tracking-wide rounded-full transition-all duration-300 ${
          categoryFilter === "laptops"
             ? "bg-white text-slate-800 shadow-sm" 
            : "bg-transparent text-slate-500 hover:text-slate-700 hover:bg-white/30"
        }`}
      >
        Laptops
      </button>
    </div>
  );
};

export default ProductFilter;