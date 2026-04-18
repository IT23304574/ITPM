const express = require('express');
const router = express.Router();
const { submitMessage, getMessages, deleteMessage } = require('../controllers/contactController');

router.post('/', submitMessage);
router.get('/', getMessages);
router.delete('/:id', deleteMessage);

module.exports = router;