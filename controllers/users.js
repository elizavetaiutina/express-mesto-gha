const User = require('../models/user');
const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/constants');

// ВОЗВРАЩАЕТ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' })
    );
};

// ВОЗВРАЩАЕТ ПОЛЬЗОВАТЕЛЯ ПО ИДЕНТИФИКАТОРУ
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(ERROR_CODE).send({
          message: 'Запрашиваемый пользователь не найден',
        });
      }
      return res.send(user);
    })
    .catch((err) => {
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// СОЗДАЁТ ПОЛЬЗОВАТЕЛЯ
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректно заполнены поля ввода' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
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
      console.log(err);
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректно заполнены поля ввода' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// ОБНОВЛЯЕТ АВАТАР
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((updateAvatar) => res.send(updateAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректно заполнены поля ввода' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
};