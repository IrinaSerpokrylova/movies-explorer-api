const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');

const { statusOK, created } = require('../utils/statuses');
const BadRequestError = require('../utils/errors/bad-request-error');
const ForbiddenError = require('../utils/errors/forbidden-error');

const NotFoundError = require('../utils/errors/not-found-error');
const {
  INVALID_MOVIE_DATA,
  MOVIE_REMOVED,
  INVALID_ID,
  NOT_ENOUGH_RIGHTS,
  MOVIE_NOT_FOUND,
} = require('../utils/statusMessages');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    description,
    director,
    duration,
    image,
    nameEN,
    nameRU,
    movieId,
    thumbnail,
    trailerLink,
    year,
  } = req.body;

  Movie.create({
    country,
    description,
    director,
    duration,
    image,
    movieId,
    nameEN,
    nameRU,
    thumbnail,
    trailerLink,
    owner: req.user._id,
    year,
  })
    .then((movie) => res.status(created).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(INVALID_MOVIE_DATA));
        return;
      }
      next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(MOVIE_NOT_FOUND);
      }
      if (JSON.stringify(movie.owner) !== JSON.stringify(req.user._id)) {
        throw new ForbiddenError(NOT_ENOUGH_RIGHTS);
      }
      return Movie.deleteOne(movie);
    })
    .then(() => res.status(statusOK).send({ message: MOVIE_REMOVED }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(INVALID_ID));
        return;
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovieById,
};
