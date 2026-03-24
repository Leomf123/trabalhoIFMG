const Produtos = require('../models/ProdutosModel');
const Usuario = require('../models/UsuariosModel');

// ============================================
// Christian - Listar Produtos e Deletar
// ============================================

/**
 * Controller para listar TODOS os produtos com dados das lojas
 * Usado na vitrine pública (produtos-usuario.ejs)
 * GET /produtos
 */
exports.listarTodosProdutos = async (req, res) => {
    try {
        console.log('🔍 Listando todos os produtos...');
        const produtos = await Produtos.buscarTodosProdutos();
        console.log(`✅ Encontrados ${produtos ? produtos.length : 0} produtos`);
        
        // CORREÇÃO: Nome do arquivo é produtos-usuario.ejs (singular)
        res.render('produtos-usuario', {
            produtos: produtos || [],
            title: 'Vitrine de Produtos'
        });
    } catch (error) {
        console.error('❌ Erro ao listar todos os produtos:', error);
        // CORREÇÃO: Nome do arquivo é produtos-usuario.ejs (singular)
        res.render('produtos-usuario', {
            produtos: [],
            title: 'Vitrine de Produtos',
            error: 'Erro ao carregar produtos'
        });
    }
};

/**
 * Controller para listar produtos da loja logada
 * Usado na Central da Loja (meus-produtos.ejs)
 * GET /meus-produtos
 */
exports.meusProdutos = async (req, res) => {
    try {
        console.log('🔍 Listando meus produtos...');
        
        // Verifica se usuário está logado
        if (!req.session.usuario || !req.session.usuario.id) {
            console.log('⚠️ Usuário não está logado');
            req.flash('error', 'Você precisa estar logado para acessar esta página');
            return res.redirect('/login/index');
        }
        
        const usuarioId = req.session.usuario.id;
        console.log(`👤 Buscando produtos do usuário ID: ${usuarioId}`);
        
        // Utiliza o método do Model para buscar produtos do usuário
        const produtos = await Produtos.buscarPorUsuario(usuarioId);
        console.log(`✅ Encontrados ${produtos ? produtos.length : 0} produtos`);
        
        res.render('meus-produtos', {
            produtos: produtos || [],
            success: req.flash('success'),
            errors: req.flash('error')
        });
    } catch (error) {
        console.error('❌ Erro ao carregar meus produtos:', error);
        req.flash('error', 'Erro ao carregar produtos');
        res.redirect('/');
    }
};

/**
 * Controller para listar produtos de um usuário específico (Perfil Público) - Christian
 * GET /usuario/:id/produtos
 */
exports.listarProdutosPorUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        console.log(`🔍 Listando produtos do usuário ID: ${usuarioId}`);
        
        // Utiliza o método do Model para buscar produtos do usuário
        const produtos = await Produtos.buscarPorUsuario(usuarioId);
        
        // Busca dados do usuário para exibir no perfil
        const usuario = await Usuario.buscarPorId(usuarioId);
        
        // CORREÇÃO: Nome do arquivo é produtos-usuario-especifico.ejs
        res.render('produtos-usuario-especifico', {
            produtos: produtos || [],
            usuario: usuario,
            title: `Produtos de ${usuario ? usuario.nomeLoja : 'Usuário'}`
        });
    } catch (error) {
        console.error('❌ Erro ao listar produtos do usuário:', error);
        res.status(500).send('Erro ao carregar produtos');
    }
};

/**
 * Controller para deletar um produto - Christian
 * POST /produtos/deletar/:id
 * Com verificação de segurança para garantir que o produto pertence ao usuário
 */
exports.deletarProduto = async (req, res) => {
    try {
        const produtoId = req.params.id;
        console.log(`🗑️ Deletando produto ID: ${produtoId}`);
        
        // Verifica se usuário está logado
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('error', 'Você precisa estar logado para deletar produtos');
            return res.redirect('/login/index');
        }
        
        const usuarioId = req.session.usuario.id;
        
        // VERIFICAÇÃO DE SEGURANÇA: Verifica se o produto pertence ao usuário
        const pertenceAoUsuario = await Produtos.verificarPropriedade(produtoId, usuarioId);
        
        if (!pertenceAoUsuario) {
            req.flash('error', 'Você não tem permissão para deletar este produto');
            return res.redirect('/meus-produtos');
        }
        
        // Utiliza o método estático do Model para deletar
        await Produtos.delete(produtoId);
        
        req.flash('success', 'Produto deletado com sucesso!');
        res.redirect('/meus-produtos');
    } catch (error) {
        console.error('❌ Erro ao deletar produto:', error);
        req.flash('error', 'Erro ao deletar produto');
        res.redirect('/meus-produtos');
    }
};

// ============================================
// CONTROLLERS ADICIONAIS (para CRUD completo)
// ============================================

/**
 * Controller para exibir formulário de adicionar produto
 * GET /produtos/adicionar
 */
exports.formAdicionarProduto = (req, res) => {
    if (!req.session.usuario) {
        req.flash('error', 'Você precisa estar logado para adicionar produtos');
        return res.redirect('/login/index');
    }
    
    res.render('produtos-adicionar', {
        errors: req.flash('error')
    });
};

/**
 * Controller para adicionar um novo produto
 * POST /produtos/adicionar
 */
exports.adicionarProduto = async (req, res) => {
    try {
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('error', 'Você precisa estar logado para adicionar produtos');
            return res.redirect('/login/index');
        }
        
        const { name, description, price } = req.body;
        const usuarioId = req.session.usuario.id;
        
        if (!name || !price) {
            req.flash('error', 'Nome e preço são obrigatórios');
            return res.redirect('/produtos/adicionar');
        }
        
        const produto = new Produtos({
            name,
            description,
            price,
            usuario_id: usuarioId
        });
        
        await produto.register();
        
        if (produto.errors.length > 0) {
            req.flash('error', produto.errors.join(', '));
            return res.redirect('/produtos/adicionar');
        }
        
        req.flash('success', 'Produto adicionado com sucesso!');
        res.redirect('/meus-produtos');
    } catch (error) {
        console.error('❌ Erro ao adicionar produto:', error);
        req.flash('error', 'Erro ao adicionar produto');
        res.redirect('/produtos/adicionar');
    }
};

/**
 * Controller para exibir formulário de editar produto
 * GET /produtos/editar/:id
 */
exports.formEditarProduto = async (req, res) => {
    try {
        const produtoId = req.params.id;
        
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('error', 'Você precisa estar logado para editar produtos');
            return res.redirect('/login/index');
        }
        
        const usuarioId = req.session.usuario.id;
        
        const pertenceAoUsuario = await Produtos.verificarPropriedade(produtoId, usuarioId);
        
        if (!pertenceAoUsuario) {
            req.flash('error', 'Você não tem permissão para editar este produto');
            return res.redirect('/meus-produtos');
        }
        
        const produto = await Produtos.buscarPorId(produtoId);
        
        if (!produto) {
            req.flash('error', 'Produto não encontrado');
            return res.redirect('/meus-produtos');
        }
        
        res.render('produtos-editar', {
            produto: produto,
            errors: req.flash('error')
        });
    } catch (error) {
        console.error('❌ Erro ao carregar formulário de edição:', error);
        req.flash('error', 'Erro ao carregar produto');
        res.redirect('/meus-produtos');
    }
};

/**
 * Controller para atualizar um produto
 * POST /produtos/editar/:id
 */
exports.editarProduto = async (req, res) => {
    try {
        const produtoId = req.params.id;
        
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('error', 'Você precisa estar logado para editar produtos');
            return res.redirect('/login/index');
        }
        
        const usuarioId = req.session.usuario.id;
        
        const pertenceAoUsuario = await Produtos.verificarPropriedade(produtoId, usuarioId);
        
        if (!pertenceAoUsuario) {
            req.flash('error', 'Você não tem permissão para editar este produto');
            return res.redirect('/meus-produtos');
        }
        
        const { name, description, price } = req.body;
        
        const produto = new Produtos({
            name,
            description,
            price
        });
        
        await produto.edit(produtoId);
        
        if (produto.errors.length > 0) {
            req.flash('error', produto.errors.join(', '));
            return res.redirect(`/produtos/editar/${produtoId}`);
        }
        
        req.flash('success', 'Produto atualizado com sucesso!');
        res.redirect('/meus-produtos');
    } catch (error) {
        console.error('❌ Erro ao editar produto:', error);
        req.flash('error', 'Erro ao editar produto');
        res.redirect(`/produtos/editar/${req.params.id}`);
    }
};

/**
 * Controller para renderizar formulário de edição (já existente)
 * Mantido para compatibilidade com rotas existentes
 * GET /produtos/editar/:id
 */
exports.renderEditForm = async (req, res) => {
    try {
        const produtoId = req.params.id;
        
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('error', 'Você precisa estar logado para editar produtos');
            return res.redirect('/login/index');
        }
        
        const usuarioId = req.session.usuario.id;
        const pertenceAoUsuario = await Produtos.verificarPropriedade(produtoId, usuarioId);
        
        if (!pertenceAoUsuario) {
            req.flash('error', 'Você não tem permissão para editar este produto');
            return res.redirect('/meus-produtos');
        }
        
        const produto = await Produtos.buscarPorId(produtoId);
        
        if (!produto) {
            req.flash('error', 'Produto não encontrado');
            return res.redirect('/meus-produtos');
        }
        
        res.render('produtos-editar', {
            produto: produto,
            errors: req.flash('error')
        });
    } catch (error) {
        console.error('❌ Erro ao carregar formulário de edição:', error);
        req.flash('error', 'Erro ao carregar produto');
        res.redirect('/meus-produtos');
    }
};

/**
 * Controller para atualizar produto (já existente)
 * Mantido para compatibilidade com rotas existentes
 * POST /produtos/editar/:id
 */
exports.updateProdutoTeste = async (req, res) => {
    try {
        const produtoId = req.params.id;
        
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('error', 'Você precisa estar logado para editar produtos');
            return res.redirect('/login/index');
        }
        
        const usuarioId = req.session.usuario.id;
        const pertenceAoUsuario = await Produtos.verificarPropriedade(produtoId, usuarioId);
        
        if (!pertenceAoUsuario) {
            req.flash('error', 'Você não tem permissão para editar este produto');
            return res.redirect('/meus-produtos');
        }
        
        const { name, description, price } = req.body;
        
        const produto = new Produtos({
            name,
            description,
            price
        });
        
        await produto.edit(produtoId);
        
        if (produto.errors.length > 0) {
            req.flash('error', produto.errors.join(', '));
            return res.redirect(`/produtos/editar/${produtoId}`);
        }
        
        req.flash('success', 'Produto atualizado com sucesso!');
        res.redirect('/meus-produtos');
    } catch (error) {
        console.error('❌ Erro ao editar produto:', error);
        req.flash('error', 'Erro ao editar produto');
        res.redirect(`/produtos/editar/${req.params.id}`);
    }
};