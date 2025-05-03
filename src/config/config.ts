// Configuration that loads from environment variables
// Only server-side code can access non-NEXT_PUBLIC_ variables

const config = {
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET!,
    cookieName: process.env.COOKIE_NAME || "next-app-token",
    tokenExpiration: "7d", // 7 days
  },
  app: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    isDevelopment: process.env.NODE_ENV === "development",
  },
};

// Validate required config
const requiredServerEnvVars = ["MONGODB_URI", "JWT_SECRET"];
if (typeof window === "undefined") {
  // Only check on server
  for (const envVar of requiredServerEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Required environment variable ${envVar} is missing`);
    }
  }
}

export default config;
