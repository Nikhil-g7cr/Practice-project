import { useAppSelector, useAppDispatch } from "../../redux/hooks/reduxHooks";
import { logout } from "../../redux/features/auth/AuthenticationSlice";
import SearchBar from "./SearchBar";

const Navbar = () => {
  // 1. READ STATE: Grab the auth state from Redux
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // 2. SETUP DISPATCH: Get the dispatch function to trigger actions
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // 3. WRITE STATE: Trigger the logout action
    dispatch(logout());
  };

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <div>My App</div>
        {/* Central Search Bar */}
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>
      <div>
        {isAuthenticated ? (
          <div className="flex gap-4">
            <span>Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="bg-red-500 px-2 rounded">
              Logout
            </button>
          </div>
        ) : (
          <span>Please Log In</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
