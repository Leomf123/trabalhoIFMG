const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const {middlewareHomeInicial, middlewareHomeFinal } = require('./src/middlewares/middlewares')

// Rotas Home
router.get('/', middlewareHomeInicial, homeController.index, middlewareHomeFinal);

module.exports = router;