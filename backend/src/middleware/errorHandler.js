// Central error handler. Any route that calls next(err) lands here,
// so individual routes stay focused on their own logic instead of
// repeating try/catch response formatting everywhere.
function notFound(req, res, next) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error("[devcostoll-backend] error:", err.message);
  const status = err.status || 500;
  res.status(status).json({
    error: err.publicMessage || "Something went wrong on the server.",
    ...(process.env.NODE_ENV !== "production" && { detail: err.message }),
  });
}

module.exports = { notFound, errorHandler };
