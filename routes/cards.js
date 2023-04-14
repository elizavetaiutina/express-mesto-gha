const cardsRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  addLikeCard,
  deleteLikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCard);
cardsRouter.delete('/:cardId', deleteCard);
cardsRouter.put('/:cardId/likes', addLikeCard);
cardsRouter.delete('/:cardId/likes', deleteLikeCard);

module.exports = cardsRouter;
