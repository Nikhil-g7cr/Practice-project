import { Link } from "react-router-dom";
import SearchBar from "../../components/layout/SearchBar";

const Topbar=()=>{

    return(
        <div className="w-full h-16 bg-white shadow-md flex items-center justify-between px-4">
            <div className="text-xl font-bold text-gray-800">Stuff Store</div>
            <SearchBar/>
            <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800">
                    <Link to="/smartphones">smartphones</Link>
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                    <Link to="/laptops">laptops</Link>
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                    <Link to="/about">About</Link>
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                    <Link to="/login">Login</Link>
                </button>
                <button className="text-gray-600 hover:text-gray-800">
                    <Link to="/signup">Signup</Link>
                </button>
            </div>
        </div>
    )

}

export default Topbar;