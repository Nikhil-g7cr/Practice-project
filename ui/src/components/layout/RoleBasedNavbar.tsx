import { useAppSelector } from "../../redux/hooks/reduxHooks";
import { getAllNavItems } from "../../config/navigationConfig";
import NavItemComponent from "./NavItem";
import { useLocation } from "react-router-dom";

interface RoleBasedNavbarProps {
  closeMenu?: () => void;
  isDropdown?: boolean;
}

const RoleBasedNavbar = ({
  closeMenu,
  isDropdown = false,
}: RoleBasedNavbarProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navItems = getAllNavItems(user?.role);

  if (isDropdown) {
    // Dropdown menu format (for mobile)
    return (
      <div className="flex flex-col gap-2 p-2">
        {navItems.map((item) => (
          <NavItemComponent
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
            onClick={closeMenu}
          />
        ))}
      </div>
    );
  }

  // Horizontal menu format (for desktop)
  return (
    <div className="flex gap-2 flex-wrap">
      {navItems.map((item) => (
        <NavItemComponent
          key={item.path}
          item={item}
          isActive={location.pathname === item.path}
          onClick={closeMenu}
        />
      ))}
    </div>
  );
};

export default RoleBasedNavbar;
