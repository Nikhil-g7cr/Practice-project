import { Route, Routes } from "react-router-dom";
import Topbar from "../containers/Topbar/Topbar";
import Signup from "../components/features/Auth/Signup";
import Login from "../components/features/Auth/Login";
import Home from "../components/features/Home";
// import Home from "../components/features/Home";

const Approutes = ()=>{
    return(
        <div>
            <Topbar/>
            <Routes>
                <Route path="/" element={<Home />
                } />
                <Route path="/smartphones" element={<h1>smartphones</h1>} />
                <Route path="/laptops" element={<h1>laptops</h1>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/profile" element={<h1>Profile</h1>} />
            </Routes>
        </div>
    )

}

export default Approutes;