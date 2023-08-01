const router = require('express').Router();

const {
  getMovies,
  deleteMovieById,
  createMovie,
} = require('../controllers/movies');
const {
  validateCreateMovie,
  validateMovieById,
} = require('../middlewares/validator');

// возвращает все сохранённые текущим пользователем фильмы
router.get('/', getMovies);

/* создаёт фильм с переданными в теле country, director, duration, year,
description, image, trailer, nameRU, nameEN и thumbnail, movieId,
*/

router.post('/', validateCreateMovie, createMovie);

// удаляет сохранённый фильм по id
router.delete('/:movieId', validateMovieById, deleteMovieById);

module.exports = router;
