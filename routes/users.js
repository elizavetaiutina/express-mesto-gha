const usersRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
  getInfoUser,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUser);
usersRouter.patch('/me', updateProfile);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.get('/me', getInfoUser);

module.exports = usersRouter;
