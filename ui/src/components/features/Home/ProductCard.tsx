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
}: ProductCardProps) => {
  return (
    <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2 relative">
      {(isNew || badge) && (
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 font-label text-[10px] font-semibold rounded-full uppercase tracking-wider ${
              isNew
                ? "bg-primary text-white"
                : "bg-surface-variant text-on-surface-variant"
            }`}
          >
            {badge || (isNew ? "New" : "Sale")}
          </span>
        </div>
      )}

      <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
        <img
          alt={name}
          className="max-h-full object-contain mix-blend-multiply"
          src={image}
        />
      </div>

      <div className="flex-1 flex flex-col p-2">
        <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
          {category}
        </p>
        <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center gap-1 mt-1 mb-2">
          <span
            className="material-symbols-outlined text-[14px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-body text-[12px] text-on-surface-variant">
            {rating} ({reviews})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="font-body text-[12px] text-on-surface-variant line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span
              className={`font-headline text-[18px] font-bold ${
                originalPrice ? "text-error" : "text-on-surface"
              }`}
            >
              ${price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => onAddToCart?.(id)}
            className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary"
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
