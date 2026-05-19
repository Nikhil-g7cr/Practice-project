import { Route, Routes } from "react-router-dom";
import Topbar from "../containers/Topbar/Topbar";

const Approutes = ()=>{
    return(
        <div>
            <Topbar/>
            <Routes>
                <Route path="/" element={<h1>Home Page</h1>} />
                <Route path="/smartphones" element={<h1>smartphones</h1>} />
                <Route path="/laptops" element={<h1>laptops</h1>} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/profile" element={<h1>Profile</h1>} />
            </Routes>
        </div>
    )

}

export default Approutes;