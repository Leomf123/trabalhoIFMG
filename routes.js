const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');
//Rotas Home
router.get('/', homeController.index);

//Rota Login
router.get('/login/index', loginController.index);

router.get('/usuario/perfil', perfilController.index);

module.exports = router;