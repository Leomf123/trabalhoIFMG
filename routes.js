//criado por Wharley para resolver erros.
const isAuthenticated = require('./src/middlewares/isAuthenticated');

const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');
// wharley - importando o controller
const produtoControllerWharley = require('./src/controllers/produtoControllerWharley');


//Rotas Home
router.get('/', homeController.index);

//Rota Login
router.get('/login/index', loginController.index);

//Rota Perfil Usuário
router.get('/usuario/perfil', perfilController.index);

// Wharley - Rota para página de edição fase 01 concluida
// O ":id" é um parâmetro dinâmico na URL (ex: /produtos/editar/1)
router.get('/produtos/editar/:id', produtoControllerWharley.renderEditForm);
// Rota para salvar alterações de teste no arquivo
//router.post('/produtos/editar/:id', produtoController.updateProdutoTeste);

// Versão fase 02 Wharley - bando de dados
router.post(
    '/produtos/editar/:id',
    isAuthenticated, 
    produtoControllerWharley.updateProduto
);

// dentro do routes.js
router.get('/teste', (req, res) => {
  res.send('funcionando');
});

module.exports = router;