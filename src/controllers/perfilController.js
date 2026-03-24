const Usuario = require('../models/UsuariosModel');
const Produtos = require('../models/ProdutosModel');

// ALTERAÇÃO Christian: Controller de Perfil

// GET /controle-loja - Central de Controle da Loja
exports.controleLoja = async (req, res) => {
    try {
        // Verifica se usuário está logado
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('errors', 'Você precisa estar logado para acessar a Central de Controle');
            return res.redirect('/login/index');
        }
        
        const usuario = await Usuario.buscarPorId(req.session.usuario.id);
        const produtos = await Produtos.buscarPorUsuario(req.session.usuario.id);
        const totalProdutos = produtos ? produtos.length : 0;
        
        res.render('controleLoja', { 
            usuario: usuario,
            totalProdutos: totalProdutos,
            totalVendas: 0 // Implementar depois
        });
    } catch (error) {
        console.error('Erro ao carregar Central de Controle:', error);
        req.flash('errors', 'Erro ao carregar Central de Controle');
        res.redirect('/');
    }
}

// GET /perfil/index/ - Exibe perfil do usuário logado
exports.index = async (req, res) => {
    try {
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('errors', 'Você precisa estar logado para acessar seu perfil');
            return res.redirect('/login/index');
        }
        
        const usuario = await Usuario.buscarPorId(req.session.usuario.id);
        
        if (!usuario) {
            req.flash('errors', 'Usuário não encontrado');
            return res.redirect('/login/index');
        }
        
        res.render('perfilView', { usuario: usuario });
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        req.flash('errors', 'Erro ao carregar perfil');
        res.redirect('/');
    }
}

// GET /perfil/index/:id - Exibe formulário de edição
exports.editIndex = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('errors', 'Você precisa estar logado');
            return res.redirect('/login/index');
        }
        
        if (req.session.usuario.id != id) {
            req.flash('errors', 'Você não tem permissão para editar este perfil');
            return res.redirect('/controle-loja');
        }
        
        const usuario = await Usuario.buscarPorId(id);
        
        if (!usuario) {
            req.flash('errors', 'Usuário não encontrado');
            return res.redirect('/controle-loja');
        }
        
        res.render('editarPerfil', { usuario: usuario });
    } catch (error) {
        console.error('Erro ao carregar formulário de edição:', error);
        req.flash('errors', 'Erro ao carregar formulário');
        res.redirect('/controle-loja');
    }
}

// POST /perfil/edit/:id - Processa a edição
exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        
        if (!req.session.usuario || !req.session.usuario.id) {
            req.flash('errors', 'Você precisa estar logado');
            return res.redirect('/login/index');
        }
        
        if (req.session.usuario.id != id) {
            req.flash('errors', 'Você não tem permissão para editar este perfil');
            return res.redirect('/controle-loja');
        }
        
        const usuario = new Usuario(req.body);
        const usuarioAtualizado = await usuario.edit(id);
        
        if (usuario.errors.length > 0) {
            req.flash('errors', usuario.errors);
            return res.redirect(`/perfil/index/${id}`);
        }
        
        // Atualiza os dados na sessão
        req.session.usuario = {
            id: usuarioAtualizado.id,
            email: usuarioAtualizado.email,
            nome: usuarioAtualizado.nome,
            nomeLoja: usuarioAtualizado.nomeLoja,
            descricaoLoja: usuarioAtualizado.descricaoLoja
        };
        
        req.flash('success', 'Perfil atualizado com sucesso!');
        res.redirect(`/controle-loja`);
    } catch (error) {
        console.error('Erro ao editar perfil:', error);
        req.flash('errors', 'Erro ao editar perfil');
        res.redirect(`/controle-loja`);
    }
}