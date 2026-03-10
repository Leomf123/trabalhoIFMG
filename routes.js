const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');

//Rotas Home
router.get('/', homeController.index);

//Rota Login
router.get('/login/index', loginController.index);

module.exports = router;