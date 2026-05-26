import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../config/axios.config";

// Define a unified interface for our search results
interface SearchResult {
  _id: string;
  name: string;
  brand?: string;
  type: "phone" | "laptop" | "tablet";
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);

      try {
        // 1. Fetch BOTH phones and laptops simultaneously
        // Catching errors individually so if one fails, the other still loads
        const [phonesRes, laptopsRes] = await Promise.all([
          API.get("/phones?limit=100").catch(() => ({ data: { data: [] } })),
          API.get("/laptops?limit=100").catch(() => ({ data: { data: [] } })),
        ]);

        // 2. Safely extract arrays (handles both res.data.data and res.data structures)
        const phones = Array.isArray(phonesRes.data?.data) ? phonesRes.data.data : (Array.isArray(phonesRes.data) ? phonesRes.data : []);
        const laptops = Array.isArray(laptopsRes.data?.data) ? laptopsRes.data.data : (Array.isArray(laptopsRes.data) ? laptopsRes.data : []);

        const searchLower = searchTerm.toLowerCase();

        // 3. Filter Phones (using phone.name)
        const filteredPhones: SearchResult[] = phones
          .filter(
            (phone: any) =>
              phone.name?.toLowerCase().includes(searchLower) ||
              phone.brand?.toLowerCase().includes(searchLower)
          )
          .map((phone: any) => ({
            _id: phone._id,
            name: phone.name,
            brand: phone.brand,
            type: "phone",
          }));

        // 4. Filter Laptops (using laptop.modelName)
        const filteredLaptops: SearchResult[] = laptops
          .filter(
            (laptop: any) =>
              laptop.modelName?.toLowerCase().includes(searchLower) || 
              laptop.brand?.toLowerCase().includes(searchLower)
          )
          .map((laptop: any) => ({
            _id: laptop._id,
            name: laptop.modelName, // Map modelName to 'name' so it renders correctly
            brand: laptop.brand,
            type: "laptop",
          }));

        // Combine and set results
        setResults([...filteredPhones, ...filteredLaptops]);
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setSearchTerm("");

    if (result.type === "phone") {
      navigate(`/phone/${result._id}`);
    } else if (result.type === "laptop") {
      navigate(`/laptops/${result._id}`);
    }
  };

  return (
    // Added z-50 here so the whole search container sits above page content
    <div
      ref={wrapperRef}
      className="relative w-full max-w-sm z-[100]"
    >
      {/* Search Input */}
      <div className="glass flex items-center gap-3 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:bg-white/15 transition-all duration-300">
        <span className="material-symbols-outlined text-[18px] text-slate-500">
          search
        </span>

        <input
          type="text"
          placeholder="Search devices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (searchTerm) {
              setIsOpen(true);
            }
          }}
          className="bg-transparent outline-0 w-full text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />

        {isLoading && (
          <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-full glass rounded-[1.5rem] border border-white/20 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-sm text-slate-500 text-center font-medium">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2 max-h-72 overflow-y-auto custom-scrollbar">
              {results.map((result) => (
                <li
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className="mx-2 px-4 py-3 rounded-xl hover:bg-white/40 cursor-pointer flex justify-between items-center transition-all duration-300"
                >
                  {/* Left Content */}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-800">
                      {result.name}
                    </span>

                    {result.brand && (
                      <span className="text-xs text-slate-500 mt-0.5">
                        {result.brand}
                      </span>
                    )}
                  </div>

                  {/* Badge */}
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-indigo-700 bg-indigo-100/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/40">
                    {result.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-slate-500 text-center font-medium">
              No products found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;