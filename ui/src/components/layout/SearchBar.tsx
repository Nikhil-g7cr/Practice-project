import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../config/axios.config"; // Adjust the path to your API instance if needed

// Define a unified interface for our search results
interface SearchResult {
  _id: string;
  name: string;
  brand?: string;
  type: "phone" | "laptop" | "tablet"; // Easy to add more categories here
}

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks outside of the search bar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Fetch and filter results whenever the search term changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch products. We use a high limit here to fetch enough items to filter locally.
        // For production with thousands of items, you should add a search query parameter to your backend!
        const [phonesRes] = await Promise.all([
          API.get("/phones?limit=100") 
          // Future: API.get("/laptops?limit=100")
        ]);

        const phones = phonesRes.data.data || [];
        
        // Filter phones locally based on name or brand
        const searchLower = searchTerm.toLowerCase();
        const filteredPhones: SearchResult[] = phones
          .filter((phone: any) =>
            phone.name?.toLowerCase().includes(searchLower) ||
            phone.brand?.toLowerCase().includes(searchLower)
          )
          .map((phone: any) => ({
            _id: phone._id,
            name: phone.name,
            brand: phone.brand,
            type: "phone",
          }));

        /* --- HOW TO ADD LAPTOPS LATER ---
          const laptops = laptopsRes.data.data || [];
          const filteredLaptops: SearchResult[] = laptops.filter(...).map(laptop => ({
            _id: laptop._id,
            name: laptop.name,
            type: "laptop"
          }));
          
          setResults([...filteredPhones, ...filteredLaptops]);
        */

        setResults(filteredPhones);
        setIsOpen(true);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce to prevent making an API call on every single keystroke
    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setSearchTerm(""); // Optionally clear the search bar

    // Dynamically route the user based on the type of product they clicked
    if (result.type === "phone") {
      navigate(`/phone/${result._id}`); // Matches the route in index.tsx
    } else if (result.type === "laptop") {
      navigate(`/laptops/${result._id}`); // Setup this route in index.tsx later
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-lg mx-4 text-black">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
        placeholder="Search phones, laptops..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => {
          if (searchTerm) setIsOpen(true);
        }}
      />

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-y-auto border border-gray-200">
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((result) => (
                <li
                  key={result._id}
                  onClick={() => handleResultClick(result)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center transition-colors"
                >
                  <div>
                    <span className="block text-sm font-medium text-gray-800">{result.name}</span>
                    {result.brand && <span className="block text-xs text-gray-400">{result.brand}</span>}
                  </div>
                  <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full capitalize">
                    {result.type}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-sm text-gray-500">No products found for "{searchTerm}".</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;