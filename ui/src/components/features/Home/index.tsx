import React, { useEffect } from 'react';

const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Literata:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  :root {
    --color-on-surface-variant: #4a4e4a;
    --color-surface-container-low: #f5f1ea;
    --color-error-container: #ffdad8;
    --color-primary-fixed: #c8e8d0;
    --color-on-error-container: #690005;
    --color-inverse-on-surface: #f5f0e8;
    --color-on-surface: #2e3230;
    --color-tertiary-container: #c4a66a;
    --color-on-tertiary: #ffffff;
    --color-primary-fixed-dim: #8ecf9e;
    --color-tertiary-fixed: #f8e0a8;
    --color-surface-container-high: #eae6de;
    --color-secondary: #6b6358;
    --color-on-secondary-fixed: #1e1a13;
    --color-on-primary: #ffffff;
    --color-on-secondary: #ffffff;
    --color-outline: #74796e;
    --color-error: #b83230;
    --color-surface-tint: #4a7c59;
    --color-primary-container: #78a886;
    --color-on-primary-fixed: #002110;
    --color-surface-container: #f0ece4;
    --color-background: #faf6f0;
    --color-surface-bright: #faf6f0;
    --color-on-secondary-fixed-variant: #4a4538;
    --color-surface-dim: #dbd7cf;
    --color-surface-container-highest: #e4e0d8;
    --color-surface-container-lowest: #ffffff;
    --color-on-tertiary-fixed-variant: #554020;
    --color-on-background: #2e3230;
    --color-primary: #4a7c59;
    --color-on-error: #ffffff;
    --color-inverse-surface: #2e3230;
    --color-tertiary: #705c30;
    --color-on-tertiary-fixed: #221a05;
    --color-outline-variant: #c4c8bc;
    --color-on-tertiary-container: #554020;
    --color-secondary-container: #f0e8db;
    --color-on-secondary-container: #5e5548;
    --color-tertiary-fixed-dim: #dcc48e;
    --color-surface-variant: #e4e0d8;
    --color-surface: #faf6f0;
    --color-secondary-fixed: #f0e8db;
    --color-secondary-fixed-dim: #d4ccbf;
    --color-inverse-primary: #8ecf9e;
    --color-on-primary-fixed-variant: #2a6038;
    --color-on-primary-container: #d8f0de;
  }

  body {
    background-color: var(--color-background, #faf6f0);
    color: var(--color-on-surface, #2e3230);
    margin: 0;
  }
  
  .glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  
  .btn-primary {
    background-color: var(--color-primary, #4a7c59);
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 200ms ease-in-out;
  }
  
  .btn-primary:active {
    box-shadow: none;
    transform: translateY(2px);
  }
  
  .btn-secondary {
    border: 1px solid var(--color-tertiary, #705c30);
    color: var(--color-tertiary, #705c30);
    transition: all 200ms ease-in-out;
  }
  
  .btn-secondary:hover {
    background-color: var(--color-surface-container, #f0ece4);
  }
  
  .elevation-1 {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid var(--color-surface-variant, #e4e0d8);
  }
  
  .elevation-2:hover {
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.05);
  }
  
  .product-card {
    transition: all 200ms ease-in-out;
  }
  
  .product-card:hover {
    transform: translateY(-4px);
  }
  
  .product-image-bg {
    background-color: var(--color-background, #faf6f0);
  }
`;

export default function Home() {
  useEffect(() => {
    // Inject Custom CSS
    const styleSheet = document.createElement("style");
    styleSheet.innerText = customCSS;
    document.head.appendChild(styleSheet);

    // Inject Tailwind CDN script for utility classes used in the component
    const tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com?plugins=forms,container-queries";
    document.head.appendChild(tailwindScript);

    // Provide Tailwind config
    const configScript = document.createElement("script");
    configScript.innerHTML = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "on-surface-variant": "#4a4e4a",
            "surface-container-low": "#f5f1ea",
            "error-container": "#ffdad8",
            "primary-fixed": "#c8e8d0",
            "on-error-container": "#690005",
            "inverse-on-surface": "#f5f0e8",
            "on-surface": "#2e3230",
            "tertiary-container": "#c4a66a",
            "on-tertiary": "#ffffff",
            "primary-fixed-dim": "#8ecf9e",
            "tertiary-fixed": "#f8e0a8",
            "surface-container-high": "#eae6de",
            "secondary": "#6b6358",
            "on-secondary-fixed": "#1e1a13",
            "on-primary": "#ffffff",
            "on-secondary": "#ffffff",
            "outline": "#74796e",
            "error": "#b83230",
            "surface-tint": "#4a7c59",
            "primary-container": "#78a886",
            "on-primary-fixed": "#002110",
            "surface-container": "#f0ece4",
            "background": "#faf6f0",
            "surface-bright": "#faf6f0",
            "on-secondary-fixed-variant": "#4a4538",
            "surface-dim": "#dbd7cf",
            "surface-container-highest": "#e4e0d8",
            "surface-container-lowest": "#ffffff",
            "on-tertiary-fixed-variant": "#554020",
            "on-background": "#2e3230",
            "primary": "#4a7c59",
            "on-error": "#ffffff",
            "inverse-surface": "#2e3230",
            "tertiary": "#705c30",
            "on-tertiary-fixed": "#221a05",
            "outline-variant": "#c4c8bc",
            "on-tertiary-container": "#554020",
            "secondary-container": "#f0e8db",
            "on-secondary-container": "#5e5548",
            "tertiary-fixed-dim": "#dcc48e",
            "surface-variant": "#e4e0d8",
            "surface": "#faf6f0",
            "secondary-fixed": "#f0e8db",
            "secondary-fixed-dim": "#d4ccbf",
            "inverse-primary": "#8ecf9e",
            "on-primary-fixed-variant": "#2a6038",
            "on-primary-container": "#d8f0de"
          },
          borderRadius: {
            "DEFAULT": "0.5rem",
            "lg": "1rem",
            "xl": "1.5rem",
            "full": "9999px"
          },
          fontFamily: {
            "headline": ["Literata"],
            "display": ["Literata"],
            "body": ["Nunito Sans"],
            "label": ["Nunito Sans"]
          }
        }
      }
    }
    `;
    document.head.appendChild(configScript);

    return () => {
      document.head.removeChild(styleSheet);
      if (document.head.contains(tailwindScript)) document.head.removeChild(tailwindScript);
      if (document.head.contains(configScript)) document.head.removeChild(configScript);
    };
  }, []);

  return (
    <div className="antialiased min-h-screen flex flex-col font-body text-base">
      {/* TopNavBar */}
      {/* <nav className="bg-surface/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl docked full-width top-0 sticky border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none z-50">
        <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-7xl mx-auto z-50">
          {/* Brand Logo */}
          {/* <a className="font-display text-3xl md:text-5xl font-bold tracking-tighter text-primary dark:text-primary-fixed" href="#home">
            LUMINA TECH
          </a> */}
          
          {/* Navigation Links (Desktop) */}
          {/* <div className="hidden md:flex items-center gap-6">
            <a className="text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 font-headline text-lg font-semibold hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#smartphones">Smartphones</a>
            <a className="text-on-surface-variant dark:text-outline-variant font-headline text-lg font-semibold hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#laptops">Laptops</a>
            <a className="text-on-surface-variant dark:text-outline-variant font-headline text-lg font-semibold hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200" href="#accessories">Accessories</a>
          </div> */}
          
          {/* Trailing Icons */}
          {/* <div className="flex items-center gap-3">
            <button aria-label="Search" className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>
            <button aria-label="Profile" className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </button>
            <button aria-label="Cart" className="p-2 text-on-surface-variant hover:text-primary transition-colors duration-200">
              <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
            </button>
          </div>
        </div> */}
      {/* </nav>  */}

      {/* Main Layout */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 md:px-16 gap-6 py-20">
        {/* SideNavBar */}
        <aside className="bg-surface dark:bg-surface-container-low border-r border-outline-variant/20 h-screen w-64 hidden lg:flex flex-col flex-shrink-0">
          <div className="flex flex-col gap-6 p-6 sticky top-24">
            <div>
              <h2 className="font-headline text-lg font-semibold text-on-surface dark:text-on-surface-variant">Filters</h2>
              <p className="font-body text-sm text-on-surface-variant">Refine your search</p>
            </div>
            <nav className="flex flex-col gap-3 mt-4">
              <a className="flex items-center gap-3 p-3 text-primary dark:text-primary-fixed font-bold bg-primary-container/10 rounded-xl hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-all" href="#categories">
                <span className="material-symbols-outlined">category</span>
                <span className="font-body text-sm">Categories</span>
              </a>
              <a className="flex items-center gap-3 p-3 text-on-secondary-fixed-variant dark:text-outline-variant hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-all rounded-xl" href="#price">
                <span className="material-symbols-outlined">payments</span>
                <span className="font-body text-sm">Price Range</span>
              </a>
              <a className="flex items-center gap-3 p-3 text-on-secondary-fixed-variant dark:text-outline-variant hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-all rounded-xl" href="#brands">
                <span className="material-symbols-outlined">factory</span>
                <span className="font-body text-sm">Brands</span>
              </a>
              <a className="flex items-center gap-3 p-3 text-on-secondary-fixed-variant dark:text-outline-variant hover:bg-surface-container-highest dark:hover:bg-surface-container-high transition-all rounded-xl" href="#specs">
                <span className="material-symbols-outlined">memory</span>
                <span className="font-body text-sm">Technical Specs</span>
              </a>
            </nav>
            <button className="mt-8 btn-primary px-4 py-2 rounded-xl font-headline text-lg font-semibold w-full text-center">
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0">
          {/* Hero Section */}
          <section className="w-full bg-surface-container-lowest rounded-[2rem] elevation-1 overflow-hidden mb-20 relative elevation-2">
            <div className="absolute inset-0 z-0">
              <img alt="Hero" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_eR8uPMv6ulVz7gPmbKJPVv8VDNv_aBOz3nJVgBBaElUpPnSWpgQgf9i0eMfaP33MBmE9hli3R_CSLi2deX3gfMMR6fK4Ud0CWFkJQa1l8e8zT_rvFUs8Yih9hRHfFI96Oqg22LDJd3XJX52cTFiQRfgrYROP6U9XauxOnrw7BHBRbj8ELEZGCvTLaEWaQbjvV0mEGaQjVv4TEfkYseRvTT37BARcBXtKBNOsQa3K6KVnagkHZkP9qj5yZVrCGGvtmkHQh18tA668" />
              <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent"></div>
            </div>
            <div className="relative z-10 p-12 md:p-20 flex flex-col justify-center h-[400px] max-w-2xl">
              <span className="inline-block px-4 py-1 bg-primary-container/20 text-primary font-label text-xs font-semibold uppercase tracking-wider rounded-full w-max mb-3 border border-primary/20">
                NEW ARRIVAL
              </span>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-on-surface mb-3">
                The Next-Gen Experience.
              </h1>
              <p className="font-body text-lg text-on-surface-variant mb-6 max-w-lg">
                Discover the Nexus X. Engineered for unparalleled performance with a revolutionary titanium chassis and AI-driven optics.
              </p>
              <button className="btn-primary px-6 py-3 rounded-xl font-headline text-lg font-semibold w-max flex items-center gap-2">
                Shop Now <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Trending / New Arrivals Header */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-headline text-2xl font-semibold text-on-surface">Trending Devices</h2>
              <p className="font-body text-sm text-on-surface-variant">Top picks for professionals and creators.</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <span className="px-4 py-1 bg-surface-container text-on-surface font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-container-highest">Smartphones</span>
              <span className="px-4 py-1 bg-transparent text-on-surface-variant font-label text-xs font-semibold uppercase tracking-wider rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-container-highest">Laptops</span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Card 1 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2 relative">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-primary text-white font-label text-[10px] font-semibold rounded-full uppercase tracking-wider">New</span>
              </div>
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="Nexus X" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmXiqt-iaUkccQIcEIF8558sUFNTYjl4UXM2KleOTQ5tx9elUGS3IrOI54UlV3SYt5dY8VE9Bwww7GEYP37NLLcSaeWJA8JWvdDZKjCzTVxpgIX9ed0Bfd4oQ1nw8ivIZ9jDZs7KDUfWYMYz7ymRG1_Tpym3PglVpQgms8y_d-uAzQmlDiI4nSPKiepKeKgiX3Svj_X3t8I2p4aWbE1pHBA7P7c9Kes8GNIHWxXaq7FGrV-UnWEKF57j76xAFl4LGs0oYQvNKAV3SD" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">SMARTPHONE</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">Nexus X Pro</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.9 (128)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-headline text-[18px] text-on-surface font-bold">$1,299</span>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Card 2 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2">
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="Pixel V" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkjFMIWD7ZPZnfr0JXJFu42dN9rJIwA_5pfX9Fbm9TRK5xhLDMRCA15L-1_ZKDPdZyH6xTQjGKkItAnol2mqIBD4fC2R9qd0TEK2OG01YmpKRtVRzxXl1-MtsbKKHQPmWpiQdzYoISsTrFgGkrTaCmfcHtS4qhNVvahtnnMkwrkNHt45em09WQtWzLKo29tYLBFHbyrDUrLmEBDqmPnEhhbJrrIx_vzaLGSCfJ5VgnzKD97tRZaeWp9Q8juYfCA0Iu0ejUlmbXlFgO" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">SMARTPHONE</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">Pixel V Standard</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.7 (89)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-headline text-[18px] text-on-surface font-bold">$899</span>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Card 3 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2">
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="AeroBook Pro" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNjO4YqCKXt6GO6alYlKesBBABMCFTe5PMuPokwT0YvL6I0bZwrO1Yk5QgBEtV-LY5BnbhcxEsTgNn6t3M5htbTaLWj2mkMX0MnkLOMk8a3dmh0dM9-bkNAXYKxDwgn8dJrNCW_KMA5sFKMOR0RniKvvRi7WHBhZDh9hRZhRcy685rTLGL5aq7qdW_Uo1I4dKLr3ymYqb8S8YP0yaJxIDJ031Pb2YSSBy_oN0kMPJDFY-PqASjLZjy4BGYYuYvONLuDgAnMpJRtetT" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">LAPTOP</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">AeroBook Pro 14"</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.8 (210)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-headline text-[18px] text-on-surface font-bold">$1,499</span>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Card 4 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2 relative">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-surface-variant text-on-surface-variant font-label text-[10px] font-semibold rounded-full uppercase tracking-wider">Sale</span>
              </div>
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="Zenith 14" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAogaVEHX6sB3eCjXHSU7UK6asMgHIsC2ykmjQDwHuo9Kn_fLcZ2GJab4a3dME8XLtv_aUy40-Ec-lwkMidRxOvH238L6vpSI0medozT0iBJp_Wb1o5L4MDynps2cuFFA5OiAjiqOJrMbWLrDBxhyDKNBQWcY7KKV4gOM3_E2VXTJ4AoC44lHfec46lkG3lquMdHY63bg1VVvgEXTTB2k3WTW9xR0op4M0yhUQv8MNe4emeSVLbW_YXr5EmmryCgyIXi_hLf0LkNhNE" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">LAPTOP</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">Zenith 14 Studio</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.6 (45)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="font-body text-[12px] text-on-surface-variant line-through">$1,299</span>
                    <span className="font-headline text-[18px] text-error font-bold">$1,099</span>
                  </div>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Card 5 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2">
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="Titan 15" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC05RsAdzUcMd0d-pd61LRCa3SHX0TzQDk9KLpobirexEfedia37WPpiWwbUyHNERdkMM4ju7efxz0Sb8iW5rXSGrKVPdkAqEVUeaqu-sfTl_FmZ09lcPTlhWaI3d1lu0CX0Tcv6XZ81Mimh2pJl5Kkbnm0Ld1cJWi45oeMchLGTP7PSFPtHtHrANG4Igrvpcq3wxSuIaFtB1p2LVpBrmxq-4cZdY5G50DQZQ0yoAHXuriPCrlM3BvrbhRtnSkwO2giNs0vBOEqNTFm" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">SMARTPHONE</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">Titan 15 Rugged</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.8 (312)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-headline text-[18px] text-on-surface font-bold">$999</span>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Card 6 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2">
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="Laptop 3" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM_MaxGEaQ1K0tGM1ZxV9Tx5t0UXZ-tOsfpLlTkDXfj48_Uz4KKLD7pB24qCtT_XAE0HU6KtVd2ZaHoJdlEkXZy_sEubrr-kRUDhhtaQaoKQqTJ8Dv1Tlui8lwPjuzJCub4p1MhRJ1DagH0H06SAO7dZTBiz19nnqh6ruyqGmkuVT0CLInqCpF5eRIgny6__Ge9Ke2ovbAhfZd07QbvxfED9Cw_HIUf5qHpAB34kBHbYB-dFQhdz2WKXZYx_RzhQjxWGpsm94jQi2T" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">LAPTOP</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">AeroBook Air</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.5 (112)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-headline text-[18px] text-on-surface font-bold">$1,199</span>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Card 7 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2">
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="Phone 4" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2MF8jy58IppJbH-s3ryy85R025Dh0PBmIb_Q7xAW4GG_qzndB0Gl1EYjYFTZjWj1yH6hRcWCAINMQxyrPVj65bGfvFDctb6c_9rSWzg7OXgjDgDMSmBDkYYVYoWdsv8xsgMECXRYGHu1q2y4rwLI4BNa1L_i-c-yEdpJsNojC48MY4V5rfWXQVtCTI4tZH5yaxPLU_0GpRUPUu17j5mFpYrI8yHfAhwMovQUaWSS3eZ57HttaSqrM_zfE4LgQzh-pNOMSWpmexN0h" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">SMARTPHONE</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">Nexus Lite</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.3 (78)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-headline text-[18px] text-on-surface font-bold">$699</span>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>

            {/* Card 8 */}
            <article className="bg-surface-container-lowest rounded-2xl elevation-1 p-3 flex flex-col product-card elevation-2">
              <div className="product-image-bg h-48 rounded-xl mb-3 overflow-hidden flex items-center justify-center p-4">
                <img alt="Laptop 4" className="max-h-full object-contain mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALQnjNckLM-_P--6nnXUC3c_msoCMPRblepb7mS2shnUWEcAxO7tJQRufeqbdC9x3jB6jQ3uS2aGOF-iBHvidn1PV7iLEgNFoQa5Lq9AdDNvVeHB2OBLPjC4DYMQJoXLgrQn5cRLqJXJA1GOngg5QdOpVpRsKPSfyTXwAnekrFXmXmhINkfxi7I-uGSWilC1u8fIfWqM1aVr3esm7Lfkhy3MQeYNXJwWNdteZ64LscVA9ljf9UjvvAbai9zkSQdXXuzGhaI2njaWMA" />
              </div>
              <div className="flex-1 flex flex-col p-2">
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">LAPTOP</p>
                <h3 className="font-headline text-[16px] leading-[24px] font-semibold text-on-surface line-clamp-1">Zenith 16 Max</h3>
                <div className="flex items-center gap-1 mt-1 mb-2">
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-body text-[12px] text-on-surface-variant">4.9 (420)</span>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-headline text-[18px] text-on-surface font-bold">$2,499</span>
                  <button className="p-2 rounded-xl bg-surface-container hover:bg-primary hover:text-white transition-colors text-primary">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div className="mt-20 flex justify-center">
            <button className="btn-secondary px-6 py-2 rounded-xl font-headline text-lg font-semibold bg-surface-container-lowest">
              Load More Products
            </button>
          </div>
        </main>
      </div>

      {/* Footer */}
      {/* <footer className="bg-surface-container-lowest dark:bg-surface-container-highest border-t border-outline-variant/50 w-full mt-auto">
        <div className="w-full px-4 md:px-16 py-20 flex flex-col md:flex-row justify-between items-start gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3">
            <span className="font-headline text-2xl font-semibold text-primary dark:text-primary-fixed">
              LUMINA TECH
            </span>
            <p className="font-body text-sm text-on-surface-variant">
              © 2024 Lumina Tech. Engineering the future.
            </p>
          </div>
          <div className="flex flex-wrap gap-12 md:gap-20">
            <div className="flex flex-col gap-2">
              <span className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface mb-2">LEGAL</span>
              <a className="font-body text-sm text-on-secondary-fixed-variant dark:text-on-tertiary-fixed-variant hover:text-primary underline-offset-4 hover:underline transition-all" href="#privacy">Privacy Policy</a>
              <a className="font-body text-sm text-on-secondary-fixed-variant dark:text-on-tertiary-fixed-variant hover:text-primary underline-offset-4 hover:underline transition-all" href="#terms">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-label text-xs font-semibold uppercase tracking-wider text-on-surface mb-2">SUPPORT</span>
              <a className="font-body text-sm text-on-secondary-fixed-variant dark:text-on-tertiary-fixed-variant hover:text-primary underline-offset-4 hover:underline transition-all" href="#shipping">Shipping Info</a>
              <a className="font-body text-sm text-on-secondary-fixed-variant dark:text-on-tertiary-fixed-variant hover:text-primary underline-offset-4 hover:underline transition-all" href="#returns">Returns</a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}