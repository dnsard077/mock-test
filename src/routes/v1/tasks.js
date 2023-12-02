const express = require('express');
const taskController = require('../../controllers/taskController');
const { authenticateToken } = require('../../middlewares/auth');
const router = express.Router();

router.get('/:userid', taskController.getTaskByUserId);
router.get('/', taskController.getTaskByUserId);
router.post('/', taskController.addTask);
router.put('/:taskid', taskController.updateTask);
router.delete('/:taskid', taskController.deleteTask);


module.exports = router;
