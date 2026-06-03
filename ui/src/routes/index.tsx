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

const Approutes = () => {
  const location = useLocation();
  
  // --- UPDATED: Hide Topbar for ALL dashboard role prefixes ---
  const isDashboardRoute = 
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/dev") || 
    location.pathname.includes("/gallery")||
    location.pathname.startsWith("/manager");

  const isAuthRoute =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  return (
    <div>
      {/* Hide Topbar on dashboard routes */}
      {!isDashboardRoute && <Topbar />}
      
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/laptops" element={<LaptopDisplayScreen />} />
        <Route path="/tablets" element={<h1>tablets</h1>} />
        <Route path="/phone/:id" element={<Phone />} />
        
        {/* --- RESTORED: Image Gallery (Public) --- */}
        <Route path="/gallery" element={
          
          <PrivateRoute allowedRoles={ADMIN_DEV} >
            <ImageGallery />
          </PrivateRoute>
          } />

        {/* --- RESTORED: Profile & Cart (Any Logged-in User) --- */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/user/cart" element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        } />

        {/* --- DYNAMIC ROLE-BASED DASHBOARD ROUTES --- */}
        <Route path="/:rolePrefix" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <AdminPanel />
          </PrivateRoute>
        } />
        
        <Route path="/:rolePrefix/product" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <ProductManagement />
          </PrivateRoute>
        } />
        
        <Route path="/:rolePrefix/add-phone" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <AddProduct productType="phone" />
          </PrivateRoute>
        } />
        
        <Route path="/:rolePrefix/add-laptop" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <AddProduct productType="laptop" />
          </PrivateRoute>
        } />
        
        <Route path="/:rolePrefix/order" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <OrderManagement />
          </PrivateRoute>
        } />

        {/* STRICT ADMIN/DEV - USER MANAGEMENT ROUTES */}
        <Route path="/:rolePrefix/user" element={
          <PrivateRoute allowedRoles={ADMIN_DEV}>
            <UserManagement />
          </PrivateRoute>
        } />

        {/* Edit Phone */}
        <Route path="/phones/update/:id" element={
          <PrivateRoute allowedRoles={PRODUCT_MANAGERS}>
            <EditPhone />
          </PrivateRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default Approutes;