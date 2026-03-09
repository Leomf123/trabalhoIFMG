const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');

// Rotas Home
router.get('/', homeController.index);

module.exports = router;