/* eslint-disable max-classes-per-file */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.message = message || 'Некорректные данные';
  }
}

class BadTokenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.message = message || 'Некорректный токен';
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.message = message || 'Пользователь не найден';
  }
}
class NotUniqueEmailError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.message = message || 'Пользователь с таким email уже существует';
  }
}
class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.message = message || 'Ошибка сервера';
  }
}

module.exports = {
  ValidationError,
  BadTokenError,
  NotFoundError,
  NotUniqueEmailError,
  ServerError,
};
