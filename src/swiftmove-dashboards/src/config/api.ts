// API Gateway URL - uses environment variable for production, falls back to local for dev
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.swiftorg.me";
