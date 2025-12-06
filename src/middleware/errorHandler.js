// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error("🚨 Error:", err);

  // Prisma errors
  if (err.code) {
    switch (err.code) {
      case "P2002":
        return res.status(409).json({
          success: false,
          message: "Unique constraint violation",
          error: err.meta,
        });
      case "P2025":
        return res.status(404).json({
          success: false,
          message: "Record not found",
        });
      case "P2003":
        return res.status(400).json({
          success: false,
          message: "Foreign key constraint failed",
        });
      default:
        return res.status(500).json({
          success: false,
          message: "Database error",
          error: process.env.NODE_ENV === "development" ? err.message : undefined,
        });
    }
  }

  // Default error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong. Please try again later.",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

// 404 handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
