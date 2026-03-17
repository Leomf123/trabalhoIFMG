const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');

//Rotas Home
router.get('/', homeController.index);

//Rotas Login Usuário
router.get('/login/index', loginController.index);
router.post('/login/index', loginController.login);
router.get('/login/dashboard', loginController.loginSucessOrError);

//Rotas Perfil Usuário
router.get('/usuario/perfil', perfilController.index);

module.exports = router;