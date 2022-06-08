const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  getCurrentUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.post('/users', createUser);
router.get('/users/me', updateUserInfo);
//
router.get('/users/me', getCurrentUserInfo);
//
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
