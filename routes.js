const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
// wharley - importando o controller
const produtoController = require('./src/controllers/produtoController');

//Rotas Home
router.get('/', homeController.index);

//Rota Login
router.get('/login/index', loginController.index);

// Wharley - Rota para página de edição
// O ":id" é um parâmetro dinâmico na URL (ex: /produtos/editar/1)
router.get('/produtos/editar/:id', produtoController.renderEditForm);
// Rota para salvar alterações de teste no arquivo
router.post('/produtos/editar/:id', produtoController.updateProdutoTeste);

module.exports = router;