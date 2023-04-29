const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  TEXT_ERROR_DEFAULT,
} = require('../utils/constants');

// ВОЗВРАЩАЕТ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(
      () => res.status(ERROR_DEFAULT).send({ message: TEXT_ERROR_DEFAULT })
      // eslint-disable-next-line function-paren-newline
    );
};

// ВОЗВРАЩАЕТ ПОЛЬЗОВАТЕЛЯ ПО ИДЕНТИФИКАТОРУ
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Некорректное значение id' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: TEXT_ERROR_DEFAULT });
    });
};

// ВОЗВРАЩАЕТ ИНФОРМАЦИЮ О ТЕКУЩЕМ ПОЛЬЗОВАТЕЛЕ
const getInfoUser = (req, res) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      console.log(_id);
      if (!user) {
        return res.status(ERROR_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.log(_id);
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Некорректное значение id' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: TEXT_ERROR_DEFAULT });
    });
};

// СОЗДАЁТ ПОЛЬЗОВАТЕЛЯ
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  // хешируем пароль
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректно заполнены поля ввода' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: TEXT_ERROR_DEFAULT });
    });
};

// ОБНОВЛЯЕТ ДАННЫЕ ПРОФИЛЯ
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((updateUser) => res.send(updateUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректно заполнены поля ввода' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: TEXT_ERROR_DEFAULT });
    });
};

// ОБНОВЛЯЕТ АВАТАР
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректно заполнены поля ввода' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: TEXT_ERROR_DEFAULT });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        const error = new Error('Неправильные email или пароль');
        error.statusCode = 401;
        throw error;
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные email или пароль')); // хеши не совпали — отклоняем промис
        }
        const token = jwt.sign({ _id: user._id }, 'secret-key', {
          expiresIn: '7d',
        }); // создадим токен
        res.send({ token }); // вернём токен
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getInfoUser,
};
