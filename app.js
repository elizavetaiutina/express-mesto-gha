const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');
const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use((req, res, next) => {
  req.user = {
    _id: '64391e3626a174dee943bbab',
  };

  next();
});
app.use(router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
