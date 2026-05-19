import SearchBar from "../../components/layout/SearchBar";

const Topbar=()=>{

    return(
        <div className="w-full h-16 bg-white shadow-md flex items-center justify-between px-4">
            <div className="text-xl font-bold text-gray-800">Gaget Store</div>
            <SearchBar/>
            <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800">smartphones</button>
                <button className="text-gray-600 hover:text-gray-800">laptops</button>
                <button className="text-gray-600 hover:text-gray-800">About</button>
                <button className="text-gray-600 hover:text-gray-800">Profile</button>
            </div>
        </div>
    )

}

export default Topbar;