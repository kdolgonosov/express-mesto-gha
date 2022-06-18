class NotUniqueEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = message || 'Пользователь с таким email уже существует';
  }
}

module.exports = NotUniqueEmailError;
