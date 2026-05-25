const Ads = ()=>{
    return (
        <div className='Ads'> 
            <h1>Ads</h1>
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
        </div>
    )
}
 
export default Ads;