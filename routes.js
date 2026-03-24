const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');
const produtoListController = require('./src/controllers/produtoListController');
// NOVOS: Importando os controllers de adicionar e deletar produtos
const produtoDeleteController = require('./src/controllers/produtoDeleteController');
// Antonio - cadastra produto
const productController = require('./src/controllers/productController');
// wharley - importando o controller
const produtoControllerWharley = require('./src/controllers/produtoControllerWharley');

//Rotas Home
router.get('/', homeController.index);

//Rotas Login Usuário
router.get('/login/index', loginController.index);
router.get('/login/logout', loginController.logout);
router.post('/login/login', loginController.login);
router.post('/login/register', loginController.register);

//Rotas Perfil Usuário
router.get('/perfil/index/:id', perfilController.editIndex);
router.post('/perfil/edit/:id', perfilController.edit);

// Rotas de Produtos
// Listar produtos do usuário logado
router.get('/meus-produtos', produtoListController.index);

// Deletar produto
router.post('/produtos/deletar/:id', produtoDeleteController.deleteProduto);

// Rota para listar produtos de um usuário específico (para perfil público)
router.get('/usuario/:id/produtos', produtoListController.listarPorUsuarioId);

//antonioCadastrarProduto
router.get("/create", productController.createForm);
router.post("/create", productController.create);

// Wharley - Rota para página de edição fase 01 concluida
// O ":id" é um parâmetro dinâmico na URL (ex: /produtos/editar/1)
router.get('/produtos/editar/:id', produtoControllerWharley.renderEditForm);
// Versão fase 02 Wharley - banco de dados
router.post('/produtos/editar/:id', produtoControllerWharley.updateProduto);

module.exports = router;