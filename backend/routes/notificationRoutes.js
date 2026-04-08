const express = require('express');
const router = express.Router();
const { sendNotification, getStudentNotifications, markAsRead } = require('../controllers/notificationController');

router.post('/', sendNotification);
router.get('/:studentId', getStudentNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;