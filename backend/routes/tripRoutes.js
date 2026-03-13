const express = require('express');
const router = express.Router();

const {
  addChatMessage,
  getTripChat,
} = require('../controllers/tripController');


router.post('/:id/chat', auth, addChatMessage);
router.get('/:id/chat', auth, getTripChat);
