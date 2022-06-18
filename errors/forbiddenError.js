class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
    this.message = message || 'Недостаточно прав';
  }
}

module.exports = ForbiddenError;
