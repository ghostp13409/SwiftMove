// Utility function to convert role string to expected format
export const normalizeRole = (role: string): "CLIENT" | "DRIVER" | "ADMIN" => {
  const upperRole = role.toUpperCase();
  if (upperRole === "CLIENT") return "CLIENT";
  if (upperRole === "DRIVER") return "DRIVER";
  if (upperRole === "ADMIN") return "ADMIN";
  // If it's already one of the expected forms just return as-is
  return upperRole as "CLIENT" | "DRIVER" | "ADMIN";
};

// Utility function to convert role string to expected format for Google OAuth
export const normalizeGoogleRole = (
  role: string,
): "CLIENT" | "DRIVER" | "ADMIN" => {
  const lowerRole = role.toLowerCase();
  if (lowerRole === "client") return "CLIENT";
  if (lowerRole === "driver") return "DRIVER";
  if (lowerRole === "admin") return "ADMIN";
  // If it's already one of the expected forms just return as-is
  return lowerRole as "CLIENT" | "DRIVER" | "ADMIN";
};
