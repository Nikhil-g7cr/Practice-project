import { Route, Routes, useLocation } from "react-router-dom";
import Topbar from "../containers/Topbar/Topbar";
import Signup from "../components/features/Auth/Signup";
import Login from "../components/features/Auth/Login";
import Home from "../components/features/Home";
import LaptopDisplayScreen from "../containers/laptops/index";
import AboutPage from "../components/features/About";
import EditPhone from "../containers/phones/updatePhone";
import PrivateRoute from "./PrivateRoutes";
import Phone from "../containers/phones/Phone";
import ImageGallery from "../containers/phones/ImageGallery";
import AddProduct from "../containers/Admin/AddProduct";
import AdminPanel from "../containers/Admin/AdminPanel";
import Profile from "../containers/Profile";
import UserManagement from "../components/features/managment/User.managment";
import ProductManagement from "../components/features/managment/product.managment";
import OrderManagement from "../components/features/managment/order.managment";
import NotFoundPage from "../components/errors/NotFound";
import Cart from "../components/features/AddToCart/Cart";

// Import your Roles class
import { Roles } from "./Roles"; 

// Create Reusable Role Arrays for cleaner code
const ADMIN_DEV = [Roles.ADMIN, Roles.DEVELOPER];
const PRODUCT_MANAGERS = [Roles.ADMIN, Roles.DEVELOPER, Roles.MANAGER];
const ALL_LOGGED_IN = [Roles.ADMIN, Roles.DEVELOPER, Roles.MANAGER, Roles.TESTER, Roles.USER];

const Approutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  return (
    <div>
      {!isAdminRoute && <Topbar />}
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/laptops" element={<LaptopDisplayScreen />} />
        <Route path="/tablets" element={<h1>tablets</h1>} />
        <Route path="/phone/:id" element={<Phone />} />

        {/* LOGGED IN USER ROUTES (Cart, Profile, Gallery) */}
        <Route path="/user/cart" element={
          <PrivateRoute allowedRoles={ALL_LOGGED_IN}>
            <Cart />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute allowedRoles={ALL_LOGGED_IN}>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/gallery" element={
          <PrivateRoute allowedRoles={ALL_LOGGED_IN}>
            <ImageGallery />
          </PrivateRoute>
        } />

        {/* ADMIN/MANAGER - PRODUCT MANAGEMENT ROUTES */}
        <Route path="/admin" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route path="/admin/product" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <ProductManagement />
          </PrivateRoute>
        } />
        <Route path="/admin/add-phone" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <AddProduct productType="phone" />
          </PrivateRoute>
        } />
        <Route path="/admin/add-laptop" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <AddProduct productType="laptop" />
          </PrivateRoute>
        } />
        <Route path="/phones/update/:id" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <EditPhone />
          </PrivateRoute>
        } />
        <Route path="/admin/order" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <OrderManagement />
          </PrivateRoute>
        } />

        {/* STRICT ADMIN/DEV - USER MANAGEMENT ROUTES */}
        <Route path="/admin/user" element={
          <PrivateRoute allowedRoles={ADMIN_DEV}>
            <UserManagement />
          </PrivateRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default Approutes;