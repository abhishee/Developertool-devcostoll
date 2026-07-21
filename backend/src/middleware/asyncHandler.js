// Wraps an async route handler so any thrown error / rejected promise is
// forwarded to Express's error handler automatically. Every route in this
// backend uses this same wrapper — one pattern, reused everywhere, instead
// of each route file reinventing its own try/catch.
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { asyncHandler };
