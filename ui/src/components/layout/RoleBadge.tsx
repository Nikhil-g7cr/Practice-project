interface RoleBadgeProps {
  role?: string;
  variant?: "filled" | "outline";
}

const roleColors: Record<string, { bg: string; text: string; border: string }> =
  {
    admin: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
    tester: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    developer: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
    },
    manager: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-300",
    },
    user: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    guest: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
  };

const RoleBadge = ({ role = "guest", variant = "filled" }: RoleBadgeProps) => {
  const colors = roleColors[role.toLowerCase()] || roleColors.guest;

  if (variant === "outline") {
    return (
      <span
        className={`
          px-3 py-1 rounded-full text-sm font-semibold
          border-2 ${colors.border} ${colors.text}
        `}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  }

  return (
    <span
      className={`
        px-3 py-1 rounded-full text-sm font-semibold
        ${colors.bg} ${colors.text}
      `}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

export default RoleBadge;
