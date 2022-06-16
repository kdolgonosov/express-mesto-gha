const jwt = require('jsonwebtoken');
const {
  ValidationError, //400
  BadTokenError, //401
  NotFoundError, //404
  NotUniqueEmailError, //409
  ServerError, //500
} = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new BadTokenError('Необходима авторизация'));
  }
  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(token, 'very-stronk-secret');
  } catch {
    return next(new BadTokenError());
  }

  req.user = payload;
  return next();
};
