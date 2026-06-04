import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import {
  logout,
  performLogout,
} from "../../redux/features/auth/AuthenticationSlice";
import { Roles } from "../../routes/Roles";
import SearchBar from "../../components/layout/SearchBar";
import { BRAND_NAME } from "../../shared/shared-variables";
import CartIcon from "../../components/layout/CartIcon";

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Define role checks
  const isAdmin = isAuthenticated && user!.role === Roles.ADMIN;
  const isManager = isAuthenticated && user!.role === Roles.MANAGER;
  const isDeveloper = isAuthenticated && user!.role === Roles.DEVELOPER;

  // Check if user has access to the management panel
  const hasPanelAccess = isAdmin || isManager || isDeveloper;

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
    dispatch(performLogout());
    setShowProfileMenu(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  const rolePrefix = user ? Roles.getRolePrefix(user.role) : "user";

  return (
    <nav className="absolute left-0 right-0 mt-4 z-50">
      <div className="glass h-20 smooth-hover flex justify-between items-center w-full px-3 md:px-10 py-4 max-w-4xl mx-auto rounded-[2rem] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-slate-600 to-slate-900 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
        >
          {/* {BRAND_NAME} */}
          <img
            src="/logo1.png"
            alt="Logo"
            className="h-40 w-auto object-contain"
          />
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
            <div className="flex " ref={profileRef}>
              {/* Profile Button */}
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="glass mr-4 smooth-hover p-1 rounded-2xl hover:bg-white/20 transition-all duration-300"
                title={user.name}
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-950 via-white to-purple-200 flex items-center justify-center text-slate-800 font-bold text-sm shadow-inner border border-white/40">
                  {user.image_url ? (
                    <img
                      src={user.image_url}
                      alt={user.name}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase()
                  )}
                </div>
              </button>

              {/* Dropdown */}
              {showProfileMenu && (
                <div className="group absolute right-0 mr-4 mt-16 w-72 overflow-hidden rounded-[2rem] bg-white/18 backdrop-blur-[30px] border border-white/30 before:absolute before:inset-0 before:rounded-[2rem] before:p-[1.2px] before:bg-gradient-to-br before:from-white/70 before:via-white/10 before:to-black-200 before:pointer-events-none after:absolute after:inset-[1px] after:rounded-[1.9rem] after:bg-white/[0.04] after:backdrop-blur-[40px] after:pointer-events-none shadow-[0_10px_50px_rgba(255,255,255,0.08)] animate-glass z-50">
                  {/* Background Blur Layer */}
                  <div className="absolute inset-0 backdrop-blur-[80px] bg-white/[0.03] pointer-events-none " />

                  {/* Top Reflection */}
                  <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none" />

                  {/* Edge Light Refraction */}
                  <div className="absolute inset-0 rounded-[2rem] border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] pointer-events-none" />

                  {/* Floating Light Glow */}
                  <div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-200/25 rounded-full blur-3xl pointer-events-none" />

                  {/* Secondary Glow */}
                  <div className="absolute bottom-[-60px] right-[-40px] w-32 h-32 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

                  {/* Animated Liquid Shine */}
                  <div className="absolute top-0 left-[-130%] w-[70%] h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-[-20deg] transition-all duration-[1400ms] group-hover:left-[140%] pointer-events-none" />

                  {/* User Info */}
                  <div className="relative z-10 px-5 py-5 border-b border-white/10 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-200 via-white to-purple-200 flex items-center justify-center text-lg font-bold text-slate-800 border border-white/40 shadow-[0_8px_30px_rgba(255,255,255,0.22)] overflow-hidden">
                      {/* Avatar Refraction */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent" />

                      {/* Inner Highlight */}
                      <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white/40 blur-md" />

                      {user.image_url ? (
                        <img
                          src={user.image_url}
                          alt={user.name}
                          className="relative z-10 h-full w-full rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="relative z-10">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* User Details */}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile (Available to everyone) */}
                  <button
                    onClick={handleProfileClick}
                    className="relative z-10 w-full text-left px-5 py-3 text-sm text-slate-700 hover:bg-white/15 hover:backdrop-blur-xl hover:pl-6 transition-all duration-300"
                  >
                    View Profile
                  </button>

                  {/* Dynamic Role-Based Management Panel */}
                  {hasPanelAccess && (
                    <Link
                      to={`/${rolePrefix}`}
                      onClick={() => setShowProfileMenu(false)}
                      className="relative z-10 block w-full px-5 py-3 text-left text-sm text-slate-700 hover:bg-white/15 hover:backdrop-blur-xl hover:pl-6 transition-all duration-300"
                    >
                      {isAdmin && "Admin Panel"}
                      {isManager && "Manager Panel"}
                      {isDeveloper && "Developer Panel"}
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="relative z-10 w-full text-left px-5 py-3 text-red-500 border-t border-white/10 hover:bg-red-100/25 hover:backdrop-blur-xl hover:pl-6 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
              {/* Cart */}
              <div
                aria-label="Cart"
                onClick={() => navigate('/user/cart')}
                className="glass smooth-hover p-3 rounded-2xl text-slate-700 hover:text-black hover:bg-white/20 transition-all duration-300 cursor-pointer flex items-center justify-center"
              >
                <div className="pointer-events-none">
                  <CartIcon />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/login")}
                className="glass smooth-hover p-3 rounded-2xl text-slate-700 hover:text-black  transition-all duration-300"
              >
                {/* <span className="material-symbols-outlined flex items-center justify-center gap-1"> */}
                  <img src="/login2.png" alt="Login Icon" className="h-5 w-10 object-contain" />
                {/* </span> */}
              </button>
              <button
                onClick={() => navigate("/Signup")}
                className="glass smooth-hover p-3 rounded-2xl text-slate-700 hover:text-black  transition-all duration-300"
              >
                {/* <span className="text-[20px]"> */}
                  <img src="/signup.png" alt="Signup Icon" className="h-5 w-10 object-contain" />
                {/* </span> */}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Topbar;