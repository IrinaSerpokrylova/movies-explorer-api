const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized-error');
const { AUTHORIZATION_REQUIRED } = require('../utils/statusMessages');

module.exports = (req, res, next) => {
  const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
  // console.log(req.cookies);
  if (!req.cookies.token) {
    throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
  }

  const { token } = req.cookies;
  let payload;

  try {
    payload = jwt.verify(token, secretKey);
  } catch (err) {
    throw new UnauthorizedError(AUTHORIZATION_REQUIRED);
  }

  req.user = payload;

  next();
};
