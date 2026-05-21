import { Route, Routes } from "react-router-dom";
import Topbar from "../containers/Topbar/Topbar";
import Signup from "../components/features/Auth/Signup";
import Login from "../components/features/Auth/Login";
import Home from "../components/features/Home";
import LaptopDisplayScreen from "../containers/laptops/index";
import AboutPage from "../components/features/About";
import PhonesPage from "../containers/phones/phonesPage";
import PhoneDisplay from "../containers/phones/PhoneDisplay";
import UpdatePhone from "../containers/phones/updatePhone";
import SmartphoneProduct from "../containers/phones/Phone";
// import Home from "../components/features/Home";

const Approutes = ()=>{
    return(
        <div>
            <Topbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/tablets" element={<h1>tablets</h1>} />
                <Route path="/phones" element={<PhonesPage/>}/>
                <Route path="/phone/:id" element={<SmartphoneProduct/>}/>
                <Route path="/smartphones" element={<PhoneDisplay/>} />
                <Route path="/phones/update/:id" element={<UpdatePhone/>}/>
                <Route path="/laptops" element={<LaptopDisplayScreen/>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<AboutPage/>} />
                <Route path="/profile" element={<h1>Profile</h1>} />
            </Routes>
        </div>
    )

}

export default Approutes;