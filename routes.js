const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');
// Controllers Produto
const produtoController = require('./src/controllers/produtoController');
const { csrfProtection, isAuthenticated } = require('./src/middlewares/middlewares');

//Rotas Home
router.get('/', homeController.index);

//Rotas Login Usuário
router.get('/login/index', loginController.index);
router.get('/login/logout', isAuthenticated, loginController.logout);
router.post('/login/login', csrfProtection, loginController.login);
router.post('/login/register', csrfProtection, loginController.register);

//Rotas Perfil Usuário
router.get('/perfil/index/:id', isAuthenticated, perfilController.editIndex);
router.post('/perfil/edit/:id', csrfProtection, perfilController.edit);

// Rotas de Produtos
// Listar produtos do usuário logado
router.get('/meus-produtos', isAuthenticated, produtoController.index);

// Deletar produto
router.get('/produtos/deletar/:id', isAuthenticated, produtoController.deleteProduto);

// Cadastrar Produto
router.get("/create", isAuthenticated, produtoController.createForm);
router.post("/create", csrfProtection, produtoController.create);

// Editar Produto
router.get('/produtos/editar/:id', isAuthenticated, produtoController.renderEditForm);
router.post('/produtos/editar/:id', csrfProtection, produtoController.updateProduto);

module.exports = router;