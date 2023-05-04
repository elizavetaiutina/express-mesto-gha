const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');

const ErrorNotFound = require('./utils/errors/ErrorNotFound');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const handlerError = require('./middlewares/handlerError');
const {
  validateCreateUser,
  validateLogin,
} = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

app.post('/signin', validateLogin, login); // роуты, не требующие авторизации
app.post('/signup', validateCreateUser, createUser); // роуты, не требующие авторизации

app.use(auth); // авторизация

app.use(router);

app.use((req, res, next) => {
  next(new ErrorNotFound('Такой страницы не существет'));
});

app.use(errors());

app.use(handlerError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
