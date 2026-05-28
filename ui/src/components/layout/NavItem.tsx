import { Link } from "react-router-dom";
import type { NavItem } from "../../config/navigationConfig";

interface NavItemProps {
  item: NavItem;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItemComponent = ({
  item,
  isActive = false,
  onClick,
}: NavItemProps) => {
  return (
    <Link
      to={item.path}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
        ${
          isActive
            ? "bg-blue-700 text-white font-semibold"
            : "text-white hover:bg-blue-500 hover:text-white"
        }
      `}
      title={item.label}
    >
      {item.icon && <span className="text-lg">{item.icon}</span>}
      <span className="hidden md:inline">{item.label}</span>
    </Link>
  );
};

export default NavItemComponent;
