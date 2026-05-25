const CardsContainer = ()=>{
    return (
        <div className='CardsContainer'> 
            <h1>CardsContainer</h1>
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
           
        </div>
    )
}
 
export default CardsContainer;