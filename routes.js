const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');
const produtoListController = require('./src/controllers/produtoListController');
// NOVOS: Importando os controllers de adicionar e deletar produtos
const produtoDeleteController = require('./src/controllers/produtoDeleteController');
// Controllers Produto
const produtoController = require('./src/controllers/produtoController');

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

// Cadastrar Produto
router.get("/create", produtoController.createForm);
router.post("/create", produtoController.create);

// Editar Produto
router.get('/produtos/editar/:id', produtoController.renderEditForm);
router.post('/produtos/editar/:id', produtoController.updateProduto);

module.exports = router;