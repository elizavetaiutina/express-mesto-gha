const { celebrate, Joi } = require('celebrate');

const { regExp } = require('../utils/constants');

const validateGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required(),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regExp),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regExp),
  }),
});

const validateCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required(),
  }),
});

module.exports = {
  validateGetUser,
  validateCreateUser,
  validateUpdateProfile,
  validateUpdateAvatar,
  validateLogin,
  validateCreateCard,
  validateCard,
};
