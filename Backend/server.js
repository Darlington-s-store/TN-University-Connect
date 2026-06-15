import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

// Import Routes
import authRoutes from "./routes/auth.js";
import verificationRoutes from "./routes/verification.js";
import announcementRoutes from "./routes/announcements.js";
import blogRoutes from "./routes/blogs.js";
import messageRoutes from "./routes/messages.js";
import studentRoutes from "./routes/students.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

// 1. Basic Security Headers (Helmet)
app.use(helmet());

// 2. CORS configuration (Restricting origins to protect frontends)
app.use(
  cors({
    origin: isProduction
      ? process.env.FRONTEND_URL
      : ["http://localhost:8080", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// 3. Rate Limiting Middleware
// Strict limiter for authentication and OTP endpoints (10 requests per 15 mins)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 10 : 1000, // allow 1000 requests in dev for testing
  message: {
    error: true,
    message:
      "Too many authentication or OTP attempts from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Standard limiter for general API routes (100 requests per 15 mins)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 100 : 5000, // allow 5000 requests in dev for testing
  message: {
    error: true,
    message: "Too many requests from this IP. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Morgan Request Logging
if (!isProduction) {
  app.use(morgan("dev"));
}

// 6. Mount API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/verification", authLimiter, verificationRoutes);
app.use("/api/announcements", generalLimiter, announcementRoutes);
app.use("/api/blogs", generalLimiter, blogRoutes);
app.use("/api/messages", generalLimiter, messageRoutes);
app.use("/api/students", generalLimiter, studentRoutes);
app.use("/api/settings", generalLimiter, settingsRoutes);

// Base Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TN Universities Connect Secure API is running.",
  });
});

// Catch-all 404 Route
app.use((req, res) => {
  res.status(404).json({ error: true, message: "Endpoint not found." });
});

// 7. Centralized Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("[GLOBAL SERVER ERROR]:", err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;

  // Clean error response hiding internal details/stack in production
  res.status(statusCode).json({
    error: true,
    message: isProduction
      ? "An internal server error occurred."
      : err.message || "An internal server error occurred.",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(
    `[SERVER RUNNING]: Server listening on port ${PORT} in ${process.env.NODE_ENV || "development"} mode.`,
  );
});
