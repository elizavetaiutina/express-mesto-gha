const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');
const { ERROR_NOT_FOUND } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
/*
app.use((req, res, next) => {
  req.user = {
    _id: '64391e3626a174dee943bbab',
  };

  next();
});*/

app.post('/signin', login); // роуты, не требующие авторизации
app.post('/signup', createUser); // роуты, не требующие авторизации

app.use(auth); // авторизация

app.use(router);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Произошла ошибка' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
