const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { INVALID_URL } = require('../utils/statusMessages');

module.exports.validateUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.required(), // duration — длительность фильма. Обязательное поле-число.
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error(INVALID_URL);
        }
        return value;
      }),
    trailerLink: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error(INVALID_URL);
        }
        return value;
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error(INVALID_URL);
        }
        return value;
      }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.validateMovieById = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
});
