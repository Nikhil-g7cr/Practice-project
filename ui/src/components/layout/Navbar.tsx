import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/reduxHooks";
import { logout } from "../../redux/features/auth/AuthenticationSlice";
import SearchBar from "./SearchBar";
import RoleBasedNavbar from "./RoleBasedNavbar";
import RoleBadge from "./RoleBadge";

const Navbar = () => {
  // 1. READ STATE: Grab the auth state from Redux
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 2. State for mobile menu dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 3. Handle logout
  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/");
  };

  // 4. Handle navigation to profile
  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  // 5. Handle navigation to home/logo
  const handleLogoClick = () => {
    navigate("/");
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="p-4">
        {/* Top Bar: Logo, Search, User Info */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          {/* Logo/Brand */}
          <div
            onClick={handleLogoClick}
            className="text-2xl font-bold cursor-pointer hover:text-blue-200 transition-colors"
          >
            🛍️ My App
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="flex-1 hidden md:flex justify-center max-w-md">
            <SearchBar />
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Role Badge */}
                <RoleBadge role={user?.role} variant="outline" />

                {/* User Name */}
                <span className="hidden sm:inline font-semibold">
                  Welcome, {user?.name}!
                </span>

                {/* Profile Button */}
                <button
                  onClick={handleProfileClick}
                  className="bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded transition-colors"
                >
                  👤 Profile
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition-colors"
                >
                  Logout
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="md:hidden bg-blue-500 hover:bg-blue-400 px-3 py-2 rounded transition-colors"
                >
                  ☰
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Bar - Role-Based */}
        {isAuthenticated && (
          <div className="mt-4">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <RoleBasedNavbar isDropdown={false} />
            </div>

            {/* Mobile Navigation (Dropdown) */}
            {isDropdownOpen && (
              <div className="md:hidden mt-3 border-t pt-3 border-blue-500">
                <RoleBasedNavbar
                  isDropdown={true}
                  closeMenu={() => setIsDropdownOpen(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Mobile Search Bar - Show on mobile only */}
        {isAuthenticated && (
          <div className="md:hidden mt-3 flex justify-center">
            <SearchBar />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
