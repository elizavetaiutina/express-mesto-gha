const usersRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getInfoUser,
} = require('../controllers/users');
const {
  validateGetUser,
  validateUpdateProfile,
  validateUpdateAvatar,
} = require('../middlewares/validation');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getInfoUser);
usersRouter.get('/:userId', validateGetUser, getUser);
usersRouter.patch('/me', validateUpdateProfile, updateProfile);
usersRouter.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

module.exports = usersRouter;
