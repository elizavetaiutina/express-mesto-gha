const Card = require('../models/card');
const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
} = require('../utils/constants');

// ВОЗВРАЩАЕТ ВСЕ КАРТОЧКИ
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() =>
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' })
    );
};

// СОЗДАЁТ НОВУЮ КАРТОЧКУ
const createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
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

// УДАЛЯЕТ КАРТОЧКУ ПО ИДЕНТИФИКАТОРУ
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемая карта не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректное значение id карты' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
    });
};

// ПОСТАВИТЬ ЛАЙК КАРТОЧКЕ
const addLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемая карта не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректное значение id карты' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ err, message: 'Произошла ошибка' });
    });
};

// УБРАТЬ ЛАЙК С КАРТОЧКИ
const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return res
          .status(ERROR_NOT_FOUND)
          .send({ message: 'Запрашиваемая карта не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(ERROR_CODE)
          .send({ message: 'Некорректное значение id карты' });
        return;
      }
      res.status(ERROR_DEFAULT).send({ err, message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
