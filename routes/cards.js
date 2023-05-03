const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');
const {
  validateCreateCard,
  validateCard,
} = require('../middlewares/validation');

cardsRouter.get('/', getCards);
cardsRouter.post('/', validateCreateCard, createCard);
cardsRouter.delete('/:cardId', validateCard, deleteCard);
cardsRouter.put('/:cardId/likes', validateCard, addLikeCard);
cardsRouter.delete('/:cardId/likes', validateCard, deleteLikeCard);

module.exports = cardsRouter;
