const jwt = require('jsonwebtoken');
const {
  BadTokenError, // 401
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
  } catch (err) {
    return next(new BadTokenError());
  }

  req.user = payload;
  return next();
};
