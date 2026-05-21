import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../../components/layout/SearchBar";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { logout } from "../../redux/features/auth/AuthenticationSlice";

interface User {
  id: string;
  email: string;
  name: string;
}

const Topbar = () => {
  const navigate = useNavigate();

  // 1. Grab isAuthenticated directly from Redux! No need for local state.
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fixed a small typo here (dispach -> dispatch)
  const dispatch = useAppDispatch();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Dispatch the logout action to Redux.
    // This will instantly set isAuthenticated to false in the store,
    // and this Topbar will automatically re-render!
    dispatch(logout());
    setShowProfileMenu(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const getInitials = (name?: string) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="w-full h-16 bg-white shadow-md flex items-center justify-between px-4">
      <Link to="/" className="text-xl font-bold text-gray-800 cursor-pointer">
        Stuff Store
      </Link>

      <SearchBar />

      <div className="flex items-center space-x-4">
        <Link to="/smartphones" className="text-gray-600 hover:text-gray-800">
          smartphones
        </Link>

        <Link to="/laptops" className="text-gray-600 hover:text-gray-800">
          laptops
        </Link>

        <Link to="/about" className="text-gray-600 hover:text-gray-800">
          About
        </Link>

        {/* 2. Check the Redux isAuthenticated flag directly */}
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-semibold hover:bg-primary-container transition-colors duration-200"
                title={user.name}
              >
                {getInitials(user.name)}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>

                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-sm text-red-600 transition-colors border-t border-gray-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="text-white bg-primary hover:bg-primary-container px-3 py-2 rounded-lg transition-colors duration-200 font-semibold"
            >
              Signup
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topbar;
