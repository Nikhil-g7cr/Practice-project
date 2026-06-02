interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  isNew?: boolean;
  onAddToCart?: (productId: string) => void;
  handlePhones?: (productId: string) => void;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating = 4.5,
  reviews = 100,
  badge,
  isNew,
  onAddToCart,
  handlePhones,
}: ProductCardProps) => {
  return (
    <article className="product-card glass smooth-hover float-animation flex flex-col rounded-[2rem] p-5 w-full min-w-[260px] max-w-[300px] h-[450px] relative mx-auto">
      {/* Badge Section */}
      {(isNew || badge) && (
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 font-label text-[10px] font-semibold rounded-full uppercase tracking-wider ${isNew ? "bg-primary text-white" : "bg-surface-variant text-on-surface-variant"}`}
          >
            {badge || (isNew ? "New" : "Sale")}
          </span>
        </div>
      )}

      {/* Fixed Image Container (Always 200px height, centered content) */}
      <div
        onClick={() => handlePhones?.(id)}
        className="h-[250px] w-full flex items-center justify-center bg-white rounded-3xl cursor-pointer p-4 mb-2 shrink-0 overflow-hidden"
      >
        <img
          alt={name}
          className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
          src={image || '/NotFound.png'} // Fallback image added here
        />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex flex-col w-full">
        {/* Category - Fixed height to avoid shifting */}
        <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1 h-[15px] truncate">
          {category || "Uncategorized"}
        </p>

        {/* Name - Line clamped and fixed height (48px reserves exactly 2 lines of 24px text) */}
        <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-2 h-[48px] overflow-hidden">
          {name}
        </h3>

        {/* Rating - Fixed height */}
        <div className="flex items-center gap-1 mt-1 h-[20px]">
          <span
            className="material-symbols-outlined text-[14px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-body text-[12px] text-on-surface-variant">
            {rating || "0.0"} ({reviews || "0"})
          </span>
        </div>

        {/* Footer Area (Price & Cart) - mt-auto pushes it to the absolute bottom */}
        <div className="flex items-center justify-between pt-1 border-t border-white/10">
          {/* Price Box - Fixed height of 45px, aligned to bottom so it doesn't jump if original price is missing */}
          <div className="flex flex-col justify-end h-[45px]">
            {originalPrice && (
              <span className="font-body text-[12px] text-on-surface-variant line-through leading-none mb-1">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
            <span
              className={`font-headline text-[18px] font-bold leading-none ${originalPrice ? "text-error" : "text-on-surface"}`}
            >
              ₹{price?.toFixed(2)}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart?.(id)}
            className="p-3 rounded-2xl glass hover:bg-white/20 transition-all duration-300 text-primary hover:scale-110 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">
              shopping_cart
            </span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
