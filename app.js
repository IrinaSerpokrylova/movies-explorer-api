require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/error-handler');
const routes = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } =
  process.env;

const limiter = require('./utils/limiter');

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log('connected to db');
  });

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://movies.melomori.nomoredomainsicu.ru',
      'http://movies.melomori.nomoredomainsicu.ru',
      'http://api.movies.melomori.nomoreparties.co',
      'https://api.movies.melomori.nomoreparties.co',
    ],
    credentials: true,
  }),
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
