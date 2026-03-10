const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const {middlewareHomeInicial, middlewareHomeFinal } = require('./src/middlewares/middlewares')

//Rotas Home
router.get('/', middlewareHomeInicial, homeController.index, middlewareHomeFinal);

//Rotas Cadastrar Usuário
//router.get('/usuario/cadastrar', cadastrarUsuarioController.index);
//router.get('/usuario/:id', cadastrarUsuarioController.sucess);
//router.post('/usuario/cadastrar', cadastrarUsuarioController.register);

//Rota Login
router.get('/login/index', loginController.index);

module.exports = router;