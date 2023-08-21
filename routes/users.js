const router = require('express').Router();

const { updateUserProfile, getUser } = require('../controllers/users');

const { validateUpdateUserProfile } = require('../middlewares/validator');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', validateUpdateUserProfile, updateUserProfile);

module.exports = router;
