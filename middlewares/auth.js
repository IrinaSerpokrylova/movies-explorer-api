const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized-error');

module.exports = (req, res, next) => {
  const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
  // console.log(req);
  if (!req.cookies.token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;

  next();
};
