import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { logout } from "../../redux/features/auth/AuthenticationSlice";
import { Roles } from "../../routes/Roles";
import SearchBar from "../../components/layout/SearchBar";
import { BRAND_NAME } from "../../shared/shared-variables";

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === Roles.ADMIN;

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
    dispatch(logout());
    setShowProfileMenu(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  return (
    <nav className="mt-4">
      <div className="glass h-20 smooth-hover flex justify-between items-center w-full px-3 md:px-10 py-4 max-w-4xl mx-auto rounded-[2rem] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl">
        
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
        >
          {BRAND_NAME}
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          {/* Search */}
          <button
            aria-label="Search"
            className=" flex align-middle smooth-hover p-3 rounded-2xl text-slate-700  hover:bg-white/20 "
          >
            <SearchBar />
          </button>

          {/* Auth/Profile */}
          {isAuthenticated && user ? (
            <div className="relative" ref={profileRef}>
              
              {/* Profile Button */}
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="glass smooth-hover p-1 rounded-2xl hover:bg-white/20 transition-all duration-300"
                title={user.name}
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-200 via-white to-purple-200 flex items-center justify-center text-slate-800 font-bold text-sm shadow-inner border border-white/40">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-4 w-72 glass rounded-[2rem] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden backdrop-blur-3xl animate-glass z-50">

                  {/* User Info */}
                  <div className="px-5 py-5 border-b border-white/10 flex items-center gap-4">
                    
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-300 via-white to-purple-300 flex items-center justify-center text-lg font-bold text-slate-800 shadow-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile */}
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-5 py-3 hover:bg-white/20 transition-all duration-300 text-sm text-slate-700"
                  >
                    View Profile
                  </button>

                  {/* Admin */}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="block w-full px-5 py-3 text-left text-sm text-slate-700 hover:bg-white/20 transition-all duration-300"
                    >
                      Admin Panel
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3 hover:bg-red-100/40 text-red-500 transition-all duration-300 border-t border-white/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="glass smooth-hover p-3 rounded-2xl text-slate-700 hover:text-black hover:bg-white/20 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[24px]">
                person
              </span>
            </button>
          )}

          {/* Cart */}
          <button
            aria-label="Cart"
            className="glass smooth-hover p-3 rounded-2xl text-slate-700 hover:text-black hover:bg-white/20 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-[24px]">
              shopping_cart
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;