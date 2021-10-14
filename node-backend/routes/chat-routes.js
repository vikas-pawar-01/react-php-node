const express = require('express');

const router = express.Router();

const chatController = require('../controller/chat-controller');

router.get('/', chatController.getChat);

module.exports = router;