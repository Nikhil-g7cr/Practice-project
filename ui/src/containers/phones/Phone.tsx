import { useState, useEffect, useRef } from "react";
import "./Phone.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { Roles } from "../../routes/Roles";
import { syncCartItem } from "../../redux/features/cart/CartSlice";

const SmartphoneProduct = () => {
  // get the phones from the reduc store
  const { id } = useParams();
  console.log("Phone ID from URL:", id);
  const { phones } = useAppSelector((state) => state.phones);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const phone = phones?.find((p) => p._id === id);
  const isAdmin = isAuthenticated && user?.role === Roles.ADMIN;

  // const [phone, setPhone] = useState<any>(phone);
  const [selectedColor, setSelectedColor] = useState("Forest Green");
  const [quantity, setQuantity] = useState(1);
  const [cartStatus, setCartStatus] = useState("Add to Cart");
  const [isAdded, setIsAdded] = useState(false);
  const sectionRefs = useRef<(HTMLElement | HTMLDivElement | null)[]>([]);

  const dispatch = useAppDispatch();

  // Handle Add to Cart micro-interaction
  const handleAddToCart = () => {
    // 1. Safety check to ensure phone exists before dispatching
    if (!phone) return;

    const discountedPrice = 80;
    // 2. Pass the selected quantity along with the phone details
    dispatch(
      syncCartItem({
        productId: phone._id,
        productModel: "Phone",
        quantity: 1,
        originalPrice: phone.basePrice,
        discountPrice: discountedPrice, // Whatever your discounted field is named
      }),
    );

    setCartStatus("Added to Cart!");
    setIsAdded(true);

    setTimeout(() => {
      setCartStatus("Add to Cart");
      setIsAdded(false);
      setQuantity(1); // Optional: Reset quantity back to 1 after adding
    }, 2000);
  };

  // Scroll reveal animation logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-4");
          }
        });
      },
      { threshold: 0.1 },
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLElement | HTMLDivElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const navigate = useNavigate();
  const handleUpdate = () => {
    navigate(`/phones/update/${phone?._id}`);
  };

  return (
    <div className="bg-background text-on-background selection:bg-primary-container/30 min-h-screen font-body">
      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 mt-20 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image */}
          <div className="relative group ">
            {isAdmin && <button className="p-3 rounded-2xl glass hover:bg-white/20 transition-all duration-300 text-primary hover:scale-110" onClick={handleUpdate}>Update Phone</button>}
            <div className="aspect-square rounded-[2rem] overflow-hidden bg-white flex items-center justify-center p-8">
              <img
                alt={phone?.name || "Phone Image"}
                className="w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105"
                src={phone?.thumbnail}
              />
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-4 mt-6 justify-center">
              <div className="w-16 h-16 rounded-xl border-2 border-primary bg-surface-container cursor-pointer overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSLEoc7RMoW4SBQuLWorYpVXUG1uRMBTmw_vaFMZV9jrIarX1Zgi-YewY4vL5jsDmHK_CmJ7yZwUoTIfpuCsYdPIsP1tT51t_AD-YnOTbZ9BaE4_N2zCKtKwSM6a4wx0bEhbhZZtGr5gKGMn_e_pqrpIZJS9SHrCKx0Y6vmYMNVRn0kenlkrPRQx30aR9JvkgkNgfCQUbTQlrO-VHbcSdywUenC7Lm_5XZPQo0PGPnetjChkO-OlP6BMdqKODBaXjJdBO3h7ZW-K-g"
                  alt="Thumbnail 1"
                />
              </div>
              <div className="w-16 h-16 rounded-xl border border-outline-variant bg-surface-container cursor-pointer overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB68oYUaMkgFXNbeMXMfpjoDq1Dxf3EhmmEEEwG9jHFsEmKSBlfUOQ_h44J3gY52rn0yVJD7eT7ckN5LIU1dzGqJZwxyqryR1w7cywDLCKqRAB1Gg72Ec0t7HfWMV7swQCH5AepA4yQcy6PfR4YE1L8L7bVM7UgTrLAOKDeD6TvP6L1_QMMWizdPmqn_BydPZ4YOabi8Ju6ciUHwxbEb_XwybHGLlz8lATXZEXOie3ct4B09i2A2FdLiALjxF2qm_wUjIEC4VgLtjaV"
                  alt="Thumbnail 2"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div
            className="flex flex-col gap-6 transition-all duration-700 opacity-0 translate-y-4"
            ref={addToRefs}
          >
            <div>
              <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-xs font-bold font-label tracking-widest uppercase mb-4">
                New Arrival
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-black text-on-surface mb-2">
                {phone?.name || "Loading..."}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-tertiary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star_half
                  </span>
                </div>
                <span className="text-on-surface-variant font-body font-semibold">
                  {phone?.rating} ({phone?.reviewsCount} reviews)
                </span>
              </div>

              <p className="text-3xl font-display font-bold text-primary">
                ₹{phone?.basePrice?.toLocaleString() || "1,299"}
              </p>
            </div>

            <p className="text-on-surface-variant text-lg leading-relaxed max-w-prose">
              {/* Engineered for the visionaries. The Nexus X Pro features a recycled titanium chassis and our most advanced AI-driven optics yet. Perfectly balanced between rugged durability and refined elegance, it's the ultimate tool for capturing the world in its purest form. */}
              {phone?.description}
            </p>

            <hr className="border-outline-variant/30" />

            {/* Selection Controls */}
            <div className="flex flex-col gap-6">
              {/* Color Swatches */}
              <div>
                <p className="font-label font-bold text-xs tracking-widest uppercase mb-3">
                  Color:{" "}
                  <span className="text-primary">
                    {selectedColor || "Select a color"}
                  </span>
                </p>

                <div className="flex gap-3">
                  {/* Dynamically map over phone.colors from your database */}
                  {phone?.colors && phone.colors.length > 0 ? (
                    phone.colors.map((color) => (
                      <button
                        key={color.name}
                        title={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full transition-all ${
                          selectedColor === color.name
                            ? "ring-2 ring-offset-2 ring-primary"
                            : "hover:ring-2 ring-offset-2 ring-outline"
                        }`}
                        style={{ backgroundColor: color.hexCode }} // Use inline styles for dynamic hex codes
                      ></button>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No colors available
                    </span>
                  )}
                </div>
              </div>

              {/* Storage Options */}
              <div>
                <p className="font-label font-bold text-xs tracking-widest uppercase mb-4">
                  Storage
                </p>
                {phone?.storageVariants && phone.storageVariants.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-auto mr-auto">
                    {phone.storageVariants.map((variant) => (
                      <button
                        key={variant.storage}
                        className="px-6 py-2 rounded-lg border-2 border-primary bg-primary/5 text-primary font-bold transition-all"
                      >
                        {variant.storage}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity & CTA */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center bg-surface-container rounded-lg px-2">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2 text-primary hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <input
                    className="w-12 bg-transparent border-none text-center font-bold focus:ring-0"
                    type="number"
                    min="1"
                    value={quantity}
                    readOnly
                  />
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="p-2 text-primary hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 text-on-primary py-4 px-8 rounded-xl font-bold text-lg shadow-[0_4px_20px_rgba(46,50,48,0.06)] hover:scale-[1.02] active:scale-95 transition-all bg-gradient-to-r ${isAdded ? "from-tertiary to-[#8c743c]" : "from-primary to-[#5b8c6a]"}`}
                >
                  {cartStatus}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: "local_shipping",
              title: "Priority Shipping",
              desc: "Free express delivery on all Nexus X Pro orders worldwide.",
              color: "text-primary",
            },
            {
              icon: "verified_user",
              title: "2-Year Warranty",
              desc: "Comprehensive coverage including accidental damage protection.",
              color: "text-tertiary",
            },
            {
              icon: "eco",
              title: "Eco-Friendly Materials",
              desc: "Crafted with 100% recycled titanium and ocean-bound plastics.",
              color: "text-primary",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 bg-surface-container-low rounded-xl border border-outline-variant/10 transition-all duration-700 opacity-0 translate-y-4"
              ref={addToRefs}
            >
              <span
                className={`material-symbols-outlined text-4xl mb-4 ${feature.color}`}
              >
                {feature.icon}
              </span>
              <h3 className="font-display font-bold text-xl mb-2">
                {feature.title}
              </h3>
              <p className="text-on-surface-variant text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Specs Section */}
        <section
          className="mt-24 transition-all duration-700 opacity-0 translate-y-4"
          ref={addToRefs}
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-on-surface">
                Technical Specs
              </h2>
              <p className="text-on-surface-variant">
                The power behind the experience.
              </p>
            </div>
            <button className="text-primary font-bold flex items-center gap-1 hover:underline underline-offset-4 transition-all">
              Download Full PDF{" "}
              <span className="material-symbols-outlined text-sm">
                download
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "memory",
                label: "Processor",
                value: phone?.specifications?.processor,
                sub: "Next-gen AI architecture",
              },
              {
                icon: "smartphone",
                label: "Display",
                value: '6.7" OLED',
                sub: "120Hz Pro-Motion, 2500 nits",
              },
              {
                icon: "battery_charging_full",
                label: "Battery",
                value: phone?.specifications?.battery,
                sub: "45W Fast Charging, 24hr+ usage",
              },
              {
                icon: "photo_camera",
                label: "Camera",
                value: `${phone?.specifications?.camera} System`,
                sub: "Lidar + AI Neural Engine",
              },
            ].map((spec, index) => (
              <div
                key={index}
                className="p-6 bg-surface-container-high rounded-xl border border-outline-variant/20 hover:bg-surface-container-highest transition-colors"
              >
                <span className="material-symbols-outlined text-primary mb-4">
                  {spec.icon}
                </span>
                <p className="text-xs font-label font-black tracking-widest uppercase text-on-surface-variant mb-1">
                  {spec.label}
                </p>
                <p className="font-display font-bold text-lg">{spec.value}</p>
                <p className="text-xs text-on-surface-variant mt-2">
                  {spec.sub}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SmartphoneProduct;
