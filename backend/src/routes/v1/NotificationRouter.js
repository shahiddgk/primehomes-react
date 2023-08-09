const express = require('express');
const router = express.Router();
const NotificationController = require('../../controllers/NotificationController')
const checkAuth = require('../../middlewares/checkAuth')

router.get('/', checkAuth, NotificationController.getUserNotification)
router.get('/count', checkAuth, NotificationController.getNotificationCount)
router.patch('/:notificationID', checkAuth, NotificationController.markAsRead)
router.delete('/:notificationID', checkAuth, NotificationController.deleteNotification)

module.exports = router