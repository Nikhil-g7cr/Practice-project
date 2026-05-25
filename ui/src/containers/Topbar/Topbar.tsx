import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/reduxHooks";
import { logout } from "../../redux/features/auth/AuthenticationSlice";
import { Roles } from "../../routes/Roles";

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

  const handleSearchClick = () => {
    navigate("/search");
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
    <nav className="bg-surface/80 dark:bg-surface-container-lowest/80 backdrop-blur-xl docked full-width top-0 sticky border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none z-50">
      <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-7xl mx-auto z-50">
        {/* Logo */}
        <Link
          to="/"
          className="font-display text-3xl md:text-5xl font-bold tracking-tighter text-primary dark:text-primary-fixed hover:opacity-80 transition-opacity duration-200"
        >
          LUMINA TECH
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/smartphones"
            className="text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 font-headline text-lg font-semibold hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
          >
            Smartphones
          </Link>
          <Link
            to="/laptops"
            className="text-on-surface-variant dark:text-outline-variant font-headline text-lg font-semibold hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
          >
            Laptops
          </Link>
          <a
            href="#accessories"
            className="text-on-surface-variant dark:text-outline-variant font-headline text-lg font-semibold hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
          >
            Accessories
          </a>
          {isAdmin && (
            <Link
              to="/gallery"
              className="text-on-surface-variant dark:text-outline-variant font-headline text-lg font-semibold hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
            >
              Gallery
            </Link>
          )}
        </div>

        {/* Trailing Icons */}
        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            aria-label="Search"
            className="p-2 text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[24px]">
              search
            </span>
          </button>

          {/* Profile / Auth Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="p-2 text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
                title={user.name}
              >
                <span className="material-symbols-outlined text-[24px]">
                  person
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-surface dark:bg-surface-container rounded-lg shadow-lg z-50 border border-outline-variant/30 dark:border-outline/20">
                  <div className="px-4 py-3 border-b border-outline-variant/30 dark:border-outline/20">
                    <p className="text-sm font-semibold text-on-surface dark:text-on-surface">
                      {user.name}
                    </p>
                    <p className="text-xs text-on-surface-variant dark:text-outline-variant">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 hover:bg-surface-container dark:hover:bg-surface-container-highest text-sm text-on-surface dark:text-on-surface transition-colors"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-error/10 dark:hover:bg-error/10 text-sm text-error transition-colors border-t border-outline-variant/30 dark:border-outline/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="p-2 text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[24px]">
                person
              </span>
            </button>
          )}

          {/* Cart Button */}
          <button
            aria-label="Cart"
            className="p-2 text-on-surface-variant dark:text-outline-variant hover:text-primary dark:hover:text-primary-fixed transition-colors duration-200"
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
