const userController = require('../../controllers/userController');
const express = require('express');
const { authenticateToken } = require('../../middlewares/auth');

const router = express.Router();
router.get('/', userController.getUsers);
// router.get('/:userid', [authenticateToken], userController.getUserById);
router.get('/:userid', userController.getUserById);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.put('/:userid', userController.updateUserById);
router.delete('/:userid', userController.deleteUserById);

module.exports = router;
