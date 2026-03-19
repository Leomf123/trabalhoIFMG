// produtoAdcController.js
const db = require('../database/connection');
const path = require('path');

// Lista de categorias disponíveis
const categorias = [
    'Café da manhã',
    'Doces',
    'Salgados',
    'Bebidas',
    'Descartáveis'
];

// Renderizar formulário de adição de produto
exports.renderAddForm = (req, res) => {
    try {
        // Verificar se usuário está logado
        if (!req.session.user) {
            req.flash('errors', 'Você precisa estar logado para adicionar produtos');
            return res.redirect('/login/index');
        }

        res.render('adicionar-produto', { 
            usuario: req.session.user,
            categorias: categorias,
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("Erro ao carregar formulário:", error);
        res.status(500).send("Erro interno do servidor.");
    }
};

// Adicionar novo produto
exports.addProduto = async (req, res) => {
    try {
        // Verificar se usuário está logado
        if (!req.session.user) {
            req.flash('errors', 'Você precisa estar logado para adicionar produtos');
            return res.redirect('/login/index');
        }

        const { nome, descricao, preco, categoria } = req.body;

        // Validações básicas
        if (!nome || !descricao || !preco || !categoria) {
            req.flash('errors', 'Todos os campos são obrigatórios');
            return res.redirect('/produtos/adicionar');
        }

        if (isNaN(preco) || preco <= 0) {
            req.flash('errors', 'Preço deve ser um número válido maior que zero');
            return res.redirect('/produtos/adicionar');
        }

        // Validar se categoria é válida
        if (!categorias.includes(categoria)) {
            req.flash('errors', 'Categoria inválida');
            return res.redirect('/produtos/adicionar');
        }

        // Inserir no banco de dados
        const result = await db.run(
            `INSERT INTO products (name, description, price, categoria, usuario_id, data_criacao) 
             VALUES (?, ?, ?, ?, ?, datetime('now'))`,
            [
                nome.trim(),
                descricao.trim(),
                parseFloat(preco),
                categoria,
                req.session.user.id
            ]
        );

        console.log('Produto adicionado com ID:', result.id);

        req.flash('success', 'Produto adicionado com sucesso!');
        return res.redirect('/meus-produtos');

    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        
        // Verificar se é erro de produto duplicado
        if (error.message && error.message.includes('UNIQUE')) {
            req.flash('errors', 'Já existe um produto com este nome');
        } else {
            req.flash('errors', 'Erro ao adicionar produto');
        }
        
        return res.redirect('/produtos/adicionar');
    }
};

// Exportar categorias para uso em outros controllers
exports.getCategorias = () => categorias;