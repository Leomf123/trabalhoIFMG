const express = require('express');
const router = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const perfilController = require('./src/controllers/perfilController');
const produtoController = require('./src/controllers/produtoController');

//Rotas Home
router.get('/', homeController.index);

//Rotas Login Usuário - Leonardo
router.get('/login/index', loginController.index);
router.get('/login/logout', loginController.logout);
router.post('/login/login', loginController.login);
router.post('/login/register', loginController.register);

//Rotas Perfil Usuário - Denise
router.get('/perfil/index/', perfilController.index);
router.get('/perfil/index/:id', perfilController.editIndex);
router.post('/perfil/edit/:id', perfilController.edit);

// ============================================
// ALTERAÇÃO Christian: Nova rota para Central de Controle da Loja
// ============================================
router.get('/controle-loja', perfilController.controleLoja);

// ============================================
// Rotas de Produtos - (Listar, Deletar e Editar)
// ============================================

// Listar produtos do usuário logado (Central da Loja) - Christian
router.get('/meus-produtos', produtoController.meusProdutos);

// Editar produto - Wharley
router.get('/produtos/editar/:id', produtoController.renderEditForm);
router.post('/produtos/editar/:id', produtoController.updateProdutoTeste);

// Deletar produto - Christian
router.post('/produtos/deletar/:id', produtoController.deletarProduto);

// Listar produtos de um usuário específico (para perfil público) - Christian
router.get('/usuario/:id/produtos', produtoController.listarProdutosPorUsuario);

// Vitrine pública - Listar todos os produtos de todas as lojas - Christian
router.get('/produtos', produtoController.listarTodosProdutos);

module.exports = router;