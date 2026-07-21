// A tiny, dependency-free validation helper reused by every route that
// takes a request body. Not a replacement for a full schema library on a
// bigger project, but it keeps every endpoint validating input the same
// way instead of each one doing its own ad-hoc checks.

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
    this.publicMessage = message;
  }
}

function requireString(value, name, { maxLength = 5000, minLength = 1 } = {}) {
  if (typeof value !== "string" || value.length < minLength) {
    throw new ValidationError(`\`${name}\` is required and must be a non-empty string.`);
  }
  if (value.length > maxLength) {
    throw new ValidationError(`\`${name}\` is too long (max ${maxLength} characters).`);
  }
  return value;
}

function requireOneOf(value, name, allowed) {
  if (!allowed.includes(value)) {
    throw new ValidationError(`\`${name}\` must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

function requireIntInRange(value, name, { min, max, fallback }) {
  const n = value === undefined ? fallback : parseInt(value, 10);
  if (Number.isNaN(n)) throw new ValidationError(`\`${name}\` must be a number.`);
  return Math.min(Math.max(n, min), max);
}

module.exports = { ValidationError, requireString, requireOneOf, requireIntInRange };
