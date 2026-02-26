import React from "react";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const statusColors: Record<string, Record<"bg" | "text", string>> = {
  default: {
    bg: "bg-gray-100 dark:bg-gray-700",
    text: "text-gray-700 dark:text-gray-300",
  },
  success: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
  },
  warning: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  danger: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
  },
  info: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
  },
};

// Determine color based on status string
const getVariantFromStatus = (status: string): keyof typeof statusColors => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes("pending")) return "warning";
  if (
    statusLower.includes("accepted") ||
    statusLower.includes("completed") ||
    statusLower.includes("active")
  )
    return "success";
  if (statusLower.includes("rejected") || statusLower.includes("cancelled"))
    return "danger";
  return "info";
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className = "",
}) => {
  const actualVariant = variant || getVariantFromStatus(status);
  const colors = statusColors[actualVariant] || statusColors.default;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${className}`}
    >
      {status}
    </span>
  );
};
