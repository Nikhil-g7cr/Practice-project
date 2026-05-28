# Role-Based Navigation System Guide

## Overview

This is a comprehensive role-based navigation system that displays different menu items based on user authentication status and role.

## Components Created

### 1. **navigationConfig.ts**

Central configuration file that maps roles to navigation items.

**Key Features:**

- Base navigation items (available to all authenticated users)
- Role-specific navigation items (Admin, Tester, Developer, Manager)
- Separate unauthenticated navigation
- Helper functions to get items by role

**How to customize:**

```typescript
// Add new menu item
const authenticated: NavItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "📊",
    roles: [Roles.ADMIN, Roles.MANAGER], // Only these roles see it
  },
];
```

### 2. **NavItem.tsx**

Reusable component that renders individual navigation links.

**Features:**

- Active state highlighting
- Icon and label display
- Responsive (icons only on mobile, full labels on desktop)
- Smooth hover effects

### 3. **RoleBasedNavbar.tsx**

Main navigation component that renders items based on user role.

**Props:**

- `isDropdown` - true for vertical menu (mobile), false for horizontal (desktop)
- `closeMenu` - callback to close dropdown after navigation

**Usage:**

```tsx
<RoleBasedNavbar isDropdown={false} />
```

### 4. **RoleBadge.tsx**

Visual component that displays the user's role with color coding.

**Color Mapping:**

- Admin → Red
- Tester → Yellow
- Developer → Blue
- Manager → Purple
- User → Green
- Guest → Gray

**Usage:**

```tsx
<RoleBadge role={user?.role} variant="filled" />
```

### 5. **Updated Navbar.tsx**

Complete navbar with responsive design, role-based navigation, and all UI elements.

## Features

### ✅ Authentication State Detection

- Shows login/signup buttons when not authenticated
- Shows user profile, role badge, and logout when authenticated

### ✅ Role-Based Menu Items

- Different users see different navigation items
- Admin sees: Dashboard, Manage Products, Manage Users, Manage Orders
- Tester sees: Test Reports, Bug Tracker, Test Cases
- Developer sees: API Docs, Code Repository
- Manager sees: Analytics, Team Performance
- Everyone authenticated sees: Home, Laptops, Phones, Profile

### ✅ Responsive Design

- Desktop: Horizontal navigation bar with full labels and icons
- Mobile: Hamburger menu with vertical dropdown

### ✅ Active Route Highlighting

- Current page is highlighted in the navigation

### ✅ Mobile-Friendly

- Hamburger menu toggle
- Responsive search bar positioning
- Touch-friendly buttons

## How to Use

### 1. Ensure User Role is Stored

In your login API call, make sure the role is included:

```typescript
// In your API response
{
  user: {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
    role: "admin"  // Make sure this is included!
  },
  token: "jwt-token"
}
```

### 2. Make Sure AuthenticationSlice Stores Role

Update your login action to ensure role is saved:

```typescript
login: (state, action: PayloadAction<{ user: User; token: string }>) => {
  state.user = action.payload.user; // This includes role
  state.token = action.payload.token;
  state.isAuthenticated = true;

  // Save to session storage
  sessionStorage.setItem("user", JSON.stringify(action.payload.user));
  sessionStorage.setItem("accessToken", action.payload.token);
};
```

### 3. Customize Navigation Items

Edit `config/navigationConfig.ts`:

```typescript
// Add new admin item
adminNav: [
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: "📊",
    roles: [Roles.ADMIN],
  },
  // ... other items
];
```

### 4. Create Role-Specific Pages

Create your route pages and link them in navigationConfig:

```typescript
// pages/admin/Analytics.tsx
const AdminAnalytics = () => {
  return <div>Admin Analytics Dashboard</div>;
};
```

## Advanced Customization

### Add New Role

1. Add to `Roles.ts`:

```typescript
static CUSTOM_ROLE = 'custom_role';
```

2. Add navigation in `navigationConfig.ts`:

```typescript
customRoleNav: [
  {
    label: "Custom Page",
    path: "/custom",
    icon: "🎨",
    roles: [Roles.CUSTOM_ROLE],
  },
] as NavItem[],
```

3. Add to `getNavItemsByRole`:

```typescript
const roleNavMap: Record<string, NavItem[]> = {
  [Roles.CUSTOM_ROLE]: navigationConfig.customRoleNav,
  // ... others
};
```

### Change Role Badge Colors

Edit `RoleBadge.tsx`:

```typescript
const roleColors: Record<string, { bg: string; text: string; border: string }> =
  {
    admin: {
      bg: "bg-pink-100",
      text: "text-pink-800",
      border: "border-pink-300",
    },
    // ... customize colors
  };
```

### Add Nested Menus (Dropdowns)

Extend `NavItem` interface to support submenus:

```typescript
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  roles: string[];
  subItems?: NavItem[]; // Add this
}
```

## Directory Structure

```
src/
├── components/layout/
│   ├── Navbar.tsx                 (Main navbar)
│   ├── RoleBasedNavbar.tsx         (Role-based menu renderer)
│   ├── NavItem.tsx                 (Individual nav item)
│   ├── RoleBadge.tsx               (Role display badge)
│   └── SearchBar.tsx               (existing)
├── config/
│   ├── navigationConfig.ts         (Navigation configuration)
│   └── axiosCall.ts                (existing)
├── routes/
│   ├── Roles.ts                    (Role definitions)
│   └── index.tsx                   (existing)
└── redux/
    └── features/auth/
        └── AuthenticationSlice.ts  (existing)
```

## Testing

### Test Different Roles

Use Redux DevTools or manually test by:

1. Login with different accounts (if backend supports)
2. Use Redux DevTools to manually change user role:

```javascript
// In console
dispatch(login({ user: { name: "Test", role: "tester" }, token: "test" }));
```

3. Verify navigation items change based on role

## Troubleshooting

### Role not showing in navbar

- Check if user object is being saved with role in sessionStorage
- Verify role is included in login API response
- Check Redux DevTools to see if role is in state

### Navigation items not appearing

- Verify role is in the `roles` array of NavItem
- Check that path is correct and route exists
- Ensure Roles enum matches the role value

### Styling issues

- Tailwind CSS must be configured in your project
- Check if colors are in Tailwind config (add custom colors if needed)
- Verify responsive breakpoints (md: breakpoint at 768px)

## Future Enhancements

1. **Nested Menus**: Add submenu support for dropdown navigation
2. **Breadcrumb Navigation**: Show current path
3. **Search in Navigation**: Filter menu items by search
4. **Permissions System**: More granular control than just roles
5. **Dynamic Routes**: Load routes from backend API
6. **Menu Icons**: Replace emoji with actual icon library (React Icons, etc.)
7. **Dark Mode**: Add theme toggle support
