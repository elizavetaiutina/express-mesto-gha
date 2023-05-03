const Card = require('../models/card');
const ErrorBadRequest = require('../utils/errors/ErrorBadRequest');
const ErrorNotFound = require('../utils/errors/ErrorNotFound');
const ErrorForbidden = require('../utils/errors/ErrorForbidden');

// ВОЗВРАЩАЕТ ВСЕ КАРТОЧКИ
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

// СОЗДАЁТ НОВУЮ КАРТОЧКУ
const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Некорректно заполнены поля ввода'));
        return;
      }
      next(err);
    });
};

// УДАЛЯЕТ КАРТОЧКУ ПО ИДЕНТИФИКАТОРУ
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Запрашиваемая карта не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ErrorForbidden('Недостаточно прав для удаления карты');
      }
      card.deleteOne().then(() => res.send(`Карточка удалена`));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Некорректное значение id карты'));
        return;
      }
      next(err);
    });
};

// ПОСТАВИТЬ ЛАЙК КАРТОЧКЕ
const addLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Запрашиваемая карта не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Некорректное значение id карты'));
        return;
      }
      next(err);
    });
};

// УБРАТЬ ЛАЙК С КАРТОЧКИ
const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound('Запрашиваемая карта не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Некорректное значение id карты'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
};
