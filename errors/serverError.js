class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.message = message || 'Ошибка сервера';
  }
}

module.exports = ServerError;
