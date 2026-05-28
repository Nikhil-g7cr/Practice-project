import { Roles } from "../routes/Roles";

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  roles: string[];
}

export interface NavConfig {
  authenticated: NavItem[];
  unauthenticated: NavItem[];
  adminNav: NavItem[];
  testerNav: NavItem[];
  developerNav: NavItem[];
  managerNav: NavItem[];
}

export const navigationConfig: NavConfig = {
  // Navigation items visible to any authenticated user
  authenticated: [
    {
      label: "Home",
      path: "/",
      icon: "🏠",
      roles: [
        Roles.USER,
        Roles.ADMIN,
        Roles.DEVELOPER,
        Roles.TESTER,
        Roles.MANAGER,
        Roles.GUEST,
      ],
    },
    {
      label: "Laptops",
      path: "/laptops",
      icon: "💻",
      roles: [
        Roles.USER,
        Roles.ADMIN,
        Roles.DEVELOPER,
        Roles.TESTER,
        Roles.MANAGER,
        Roles.GUEST,
      ],
    },
    {
      label: "Phones",
      path: "/phones",
      icon: "📱",
      roles: [
        Roles.USER,
        Roles.ADMIN,
        Roles.DEVELOPER,
        Roles.TESTER,
        Roles.MANAGER,
        Roles.GUEST,
      ],
    },
    {
      label: "Profile",
      path: "/profile",
      icon: "👤",
      roles: [
        Roles.USER,
        Roles.ADMIN,
        Roles.DEVELOPER,
        Roles.TESTER,
        Roles.MANAGER,
        Roles.GUEST,
      ],
    },
  ],

  // Admin-specific navigation
  adminNav: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
      roles: [Roles.ADMIN],
    },
    {
      label: "Manage Products",
      path: "/admin/products",
      icon: "📦",
      roles: [Roles.ADMIN],
    },
    {
      label: "Manage Users",
      path: "/admin/users",
      icon: "👥",
      roles: [Roles.ADMIN],
    },
    {
      label: "Manage Orders",
      path: "/admin/orders",
      icon: "📋",
      roles: [Roles.ADMIN],
    },
  ] as NavItem[],

  // Tester-specific navigation
  testerNav: [
    {
      label: "Test Reports",
      path: "/tester/reports",
      icon: "📄",
      roles: [Roles.TESTER],
    },
    {
      label: "Bug Tracker",
      path: "/tester/bugs",
      icon: "🐛",
      roles: [Roles.TESTER],
    },
    {
      label: "Test Cases",
      path: "/tester/test-cases",
      icon: "✅",
      roles: [Roles.TESTER],
    },
  ] as NavItem[],

  // Developer-specific navigation
  developerNav: [
    {
      label: "API Docs",
      path: "/developer/api-docs",
      icon: "📚",
      roles: [Roles.DEVELOPER],
    },
    {
      label: "Code Repository",
      path: "/developer/repo",
      icon: "💾",
      roles: [Roles.DEVELOPER],
    },
  ] as NavItem[],

  // Manager-specific navigation
  managerNav: [
    {
      label: "Analytics",
      path: "/manager/analytics",
      icon: "📈",
      roles: [Roles.MANAGER],
    },
    {
      label: "Team Performance",
      path: "/manager/team",
      icon: "🎯",
      roles: [Roles.MANAGER],
    },
  ] as NavItem[],

  // Navigation for unauthenticated users
  unauthenticated: [
    {
      label: "Home",
      path: "/",
      icon: "🏠",
      roles: [],
    },
    {
      label: "About",
      path: "/about",
      icon: "ℹ️",
      roles: [],
    },
  ],
};

/**
 * Get navigation items for a specific role
 * @param role User role
 * @returns Array of navigation items for that role
 */
export const getNavItemsByRole = (role: string | undefined): NavItem[] => {
  if (!role) return [];

  const roleNavMap: Record<string, NavItem[]> = {
    [Roles.ADMIN]: navigationConfig.adminNav,
    [Roles.TESTER]: navigationConfig.testerNav,
    [Roles.DEVELOPER]: navigationConfig.developerNav,
    [Roles.MANAGER]: navigationConfig.managerNav,
  };

  return roleNavMap[role] || [];
};

/**
 * Get all navigation items for authenticated user based on their role
 * @param role User role
 * @returns Combined array of authenticated + role-specific items
 */
export const getAllNavItems = (role: string | undefined): NavItem[] => {
  const baseItems = navigationConfig.authenticated;
  const roleSpecificItems = getNavItemsByRole(role);
  return [...baseItems, ...roleSpecificItems];
};
