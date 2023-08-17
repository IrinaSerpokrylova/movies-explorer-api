const { NODE_ENV, JWT_SECRET } = process.env;

const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { statusOK, created } = require('../utils/statuses');
const BadRequestError = require('../utils/errors/bad-request-error');
const ConflictError = require('../utils/errors/conflict-error');
const {
  EMAIL_IN_USE,
  INVALID_USER_CREATION_DATA,
  INVALID_USER_UPDATE_DATA,
} = require('../utils/statusMessages');

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(statusOK).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email } = req.body;

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      console.log(user);
      res.status(created).send({
        data: {
          name: user.name,
          _id: user._id,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(EMAIL_IN_USE));
        return;
      }

      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(INVALID_USER_CREATION_DATA));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';
  const options = { expiresIn: '7d' };
  console.log(req.body);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // токен
      const token = jwt.sign({ _id: user._id }, secretKey, options);
      console.log(token);
      // устанавливаем токен в куки, с httpOnly
      res.cookie('token', token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'None',
        // secure: true,
      });
      res.status(200);
      res.send({ mesage: 'Signed in' });
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(statusOK).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(EMAIL_IN_USE));
        return;
      }

      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(INVALID_USER_UPDATE_DATA));
        return;
      }
      next(err);
    });
};

module.exports = {
  getUser,
  createUser,
  updateUserProfile,
  login,
};
