class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = message || 'Пользователь не найден';
  }
}

module.exports = NotFoundError;
