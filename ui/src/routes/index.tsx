import { Route, Routes } from "react-router-dom";
import Topbar from "../containers/Topbar/Topbar";
import Signup from "../components/features/Auth/Signup";
import Login from "../components/features/Auth/Login";
import Home from "../components/features/Home";
import LaptopDisplayScreen from "../containers/laptops/index";
import AboutPage from "../components/features/About";
import PhonesPage from "../containers/phones/phonesPage";
import PhoneDisplay from "../containers/phones/PhoneDisplay";
import EditPhone from "../containers/phones/updatePhone";

// IMPORT YOUR SINGLE PHONE COMPONENT HERE
import Phone from "../containers/phones/Phone"; 
import ImageGallery from "../containers/phones/ImageGallery";

const Approutes = ()=>{
    return(
        <div>
            <Topbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/tablets" element={<h1>tablets</h1>} />
                
                {/* Phone Routes */}
                <Route path="/phones" element={<PhonesPage/>}/>
                <Route path="/smartphones" element={<PhoneDisplay/>} />
                
                {/* NEW: Dynamic route for individual phone details */}
                <Route path="/phone/:id" element={<Phone />} />
                
                <Route path="/phones/update/:id" element={<EditPhone/>}/>
                <Route path="/gallery" element={<ImageGallery/>}/>
                
                {/* Other Routes */}
                <Route path="/laptops" element={<LaptopDisplayScreen/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<AboutPage/>} />
                <Route path="/profile" element={<h1>Profile</h1>} />
            </Routes>
        </div>
    )
}

export default Approutes;