const jwt = require('jsonwebtoken');
const BadTokenError = require('../errors/badTokenError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new BadTokenError('Необходима авторизация'));
  }
  let payload;
  const token = authorization.replace('Bearer ', '');
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'very-stronk-secret',
    );
  } catch (err) {
    return next(new BadTokenError());
  }

  req.user = payload;
  return next();
};
