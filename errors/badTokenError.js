class BadTokenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = message || 'Некорректный токен';
  }
}

module.exports = BadTokenError;
