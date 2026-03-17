const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');
// wharley - importando o controller
const produtoController = require('./src/controllers/produtoController');

//Rotas Home
router.get('/', homeController.index);

//Rotas Login Usuário
router.get('/login/index', loginController.index);
router.get('/login/logout', loginController.logout);
router.post('/login/login', loginController.login);
router.post('/login/register', loginController.register);

//Rotas Perfil Usuário
router.get('/usuario/perfil', perfilController.index);

// Wharley - Rota para página de edição
// O ":id" é um parâmetro dinâmico na URL (ex: /produtos/editar/1)
router.get('/produtos/editar/:id', produtoController.renderEditForm);
// Rota para salvar alterações de teste no arquivo
router.post('/produtos/editar/:id', produtoController.updateProdutoTeste);

module.exports = router;