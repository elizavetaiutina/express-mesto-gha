const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ErrorBadRequest = require('../utils/errors/ErrorBadRequest');
const ErrorNotFound = require('../utils/errors/ErrorNotFound');
const ErrorConflict = require('../utils/errors/ErrorConflict');
const ErrorUnauthorized = require('../utils/errors/ErrorUnauthorized');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Неправильные email или пароль');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ErrorUnauthorized('Неправильные email или пароль');
        }
        const token = jwt.sign({ _id: user._id }, 'secret-key', {
          expiresIn: '7d',
        }); // создадим токен
        return res.status(200).send({ token }); // вернём токен
      });
    })
    .catch((err) => next(err));
};

// ВОЗВРАЩАЕТ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

// ВОЗВРАЩАЕТ ПОЛЬЗОВАТЕЛЯ ПО ИДЕНТИФИКАТОРУ
const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Некорректное значение id карты'));
        return;
      }
      next(err);
    });
};

// ВОЗВРАЩАЕТ ИНФОРМАЦИЮ О ТЕКУЩЕМ ПОЛЬЗОВАТЕЛЕ
const getInfoUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Некорректное значение id карты'));
        return;
      }
      next(err);
    });
};

// СОЗДАЁТ ПОЛЬЗОВАТЕЛЯ
const createUser = (req, res, next) => {
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
      res.send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorConflict('Данный email уже существует в базе'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректно заполнены поля ввода'));
        return;
      }
      next(err);
    });
};

// ОБНОВЛЯЕТ ДАННЫЕ ПРОФИЛЯ
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((updateUser) => {
      if (!updateUser) {
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      return res.send(updateUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректно заполнены поля ввода'));
        return;
      }
      next(err);
    });
};

// ОБНОВЛЯЕТ АВАТАР
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((newAvatar) => {
      if (!newAvatar) {
        throw new ErrorNotFound('Запрашиваемый пользователь не найден');
      }
      res.send(newAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректно заполнены поля ввода'));
        return;
      }
      next(err);
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
