const jwt = require('jsonwebtoken');

const ErrorUnauthorized = require('../utils/errors/ErrorUnauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized('Необходима авторизация'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    next(new ErrorUnauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  console.log(payload);
  next();
};
