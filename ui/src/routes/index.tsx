import { Route, Routes, useLocation } from "react-router-dom";
import Topbar from "../containers/Topbar/Topbar";
import Signup from "../components/features/Auth/Signup";
import Login from "../components/features/Auth/Login";
import Home from "../components/features/Home";
import LaptopDisplayScreen from "../containers/laptops/index";
import AboutPage from "../components/features/About";
import PhonesPage from "../containers/phones/phonesPage";
import PhoneDisplay from "../containers/phones/PhoneDisplay";
import EditPhone from "../containers/phones/updatePhone";
import PrivateRoute from "./PrivateRoutes";

// IMPORT YOUR SINGLE PHONE COMPONENT HERE
import Phone from "../containers/phones/Phone";
import ImageGallery from "../containers/phones/ImageGallery";
import AddProduct from "../containers/Admin/AddProduct";
import AdminPanel from "../containers/Admin/AdminPanel";
import Profile from "../containers/Profile";
import UserManagement from "../components/features/managment/User.managment";
import ProductManagement from "../components/features/managment/product.managment";
import OrderManagement from "../components/features/managment/order.managment";
import NotFoundPage from "../components/errors/NotFound";

const Approutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminRoute && <Topbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tablets" element={<h1>tablets</h1>} />

        {/* Phone Routes */}
        <Route path="/phones" element={<PhonesPage />} />
        <Route path="/smartphones" element={<PhoneDisplay />} />

        {/* NEW: Dynamic route for individual phone details */}
        <Route path="/phone/:id" element={<Phone />} />

        <Route
          path="/phones/update/:id"
          element={
            <PrivateRoute>
              <EditPhone />
            </PrivateRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <PrivateRoute>
              <ImageGallery />
            </PrivateRoute>
          }
        />

        {/* --- ADMIN ROUTES --- */}
        {/* Wrap these in <PrivateRoute> later to ensure only Admins can access them */}
        <Route
          path="/admin/add-phone"
          element={
            <PrivateRoute>
              <AddProduct productType="phone" />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/add-laptop"
          element={
            <PrivateRoute>
              <AddProduct productType="laptop" />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/user"
          element={
            <PrivateRoute>
              <UserManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/product"
          element={
            <PrivateRoute>
              <ProductManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/order"
          element={
            <PrivateRoute>
              <OrderManagement />
            </PrivateRoute>
          }
        />

        {/* Other Routes */}
        <Route path="/laptops" element={<LaptopDisplayScreen />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </div>
  );
};

export default Approutes;
