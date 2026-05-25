const Filter = ()=>{
    return (
        <div className='Filter'> 
            <h1>Filter</h1>
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
        </div>
    )
}
 
export default Filter;