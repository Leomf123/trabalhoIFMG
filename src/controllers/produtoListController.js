const fs = require('fs');
const path = require('path');
const { getCategorias } = require('./produtoAdcController');

// Listar produtos do usuário logado
exports.index = async (req, res) => {
    try {
        // Verificar se usuário está logado
        if (!req.session.user) {
            req.flash('errors', 'Você precisa estar logado para acessar seus produtos');
            return res.redirect('/login/index');
        }

        const usuarioId = req.session.user.id;
        
        // Array para armazenar produtos
        let produtos = [];

        // TODO: Quando o banco de dados estiver pronto, substituir por:
        // const produtos = await db.all('SELECT * FROM produtos WHERE usuario_id = ?', [usuarioId]);

        // Por enquanto, vamos ler os produtos do arquivo JSON
        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        
        // Verificar se o arquivo de produtos existe
        if (fs.existsSync(produtosFilePath)) {
            // Ler o arquivo
            const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
            const todosProdutos = JSON.parse(produtosData);
            
            // Filtrar apenas os produtos do usuário logado
            produtos = todosProdutos.filter(p => p.usuario_id === usuarioId);
        }

        // Flash messages para feedback
        const success = req.flash('success');
        const errors = req.flash('errors');

        res.render('meus-produtos', { 
            produtos: produtos,
            usuario: req.session.user,
            success: success.length > 0 ? success : null,
            errors: errors.length > 0 ? errors : null
        });

    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        req.flash('errors', 'Erro ao carregar produtos');
        return res.redirect('/');
    }
};

// Listar produtos de um usuário específico (para perfil público)
exports.listarPorUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        // Buscar produtos do arquivo JSON
        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        let produtos = [];
        
        if (fs.existsSync(produtosFilePath)) {
            const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
            const todosProdutos = JSON.parse(produtosData);
            produtos = todosProdutos.filter(p => p.usuario_id == usuarioId);
        }

        res.render('produtos-usuario', { 
            produtos: produtos,
            usuarioId: usuarioId,
            usuario: req.session.user // Para a navbar
        });

    } catch (error) {
        console.error("Erro ao listar produtos do usuário:", error);
        res.status(500).send("Erro ao carregar produtos");
    }
};

// Listar produtos por categoria
exports.listarPorCategoria = (req, res) => {
    try {
        const categoriaSlug = req.params.nome;
        
        // Lista de categorias com imagens
        const categorias = [
            { 
                nome: 'Café da manhã', 
                slug: 'cafe-da-manha',
                imagem: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                descricao: 'Pães, bolos, cafés e muito mais'
            },
            { 
                nome: 'Doces', 
                slug: 'doces',
                imagem: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                descricao: 'Bolos, tortas, doces artesanais'
            },
            { 
                nome: 'Salgados', 
                slug: 'salgados',
                imagem: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                descricao: 'Coxinhas, empadas, esfihas'
            },
            { 
                nome: 'Bebidas', 
                slug: 'bebidas',
                imagem: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                descricao: 'Sucos, refrigerantes, bebidas quentes'
            },
            { 
                nome: 'Descartáveis', 
                slug: 'descartaveis',
                imagem: 'https://images.unsplash.com/photo-1605600659908-0ef7193f49be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
                descricao: 'Copos, pratos, talheres descartáveis'
            }
        ];

        // Encontrar a categoria correspondente
        const categoria = categorias.find(c => c.slug === categoriaSlug);

        if (!categoria) {
            return res.status(404).render('404');
        }

        // Buscar produtos da categoria
        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        let produtos = [];
        
        if (fs.existsSync(produtosFilePath)) {
            const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
            const todosProdutos = JSON.parse(produtosData);
            produtos = todosProdutos.filter(p => p.categoria === categoria.nome);
        }

        res.render('categoria-produtos', {
            usuario: req.session.user,
            categoria: categoria,
            produtos: produtos
        });
    } catch (error) {
        console.error("Erro ao listar por categoria:", error);
        res.status(500).send("Erro interno");
    }
};

// Buscar produto por ID (útil para detalhes)
exports.buscarPorId = (req, res) => {
    try {
        const produtoId = req.params.id;

        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        
        if (!fs.existsSync(produtosFilePath)) {
            return res.status(404).render('404');
        }

        const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
        const todosProdutos = JSON.parse(produtosData);
        
        const produto = todosProdutos.find(p => p.id == produtoId);

        if (!produto) {
            return res.status(404).render('404');
        }

        res.render('detalhe-produto', {
            usuario: req.session.user,
            produto: produto
        });

    } catch (error) {
        console.error("Erro ao buscar produto:", error);
        res.status(500).send("Erro interno");
    }
};

// Listar todos os produtos (para busca geral)
exports.listarTodos = (req, res) => {
    try {
        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        let produtos = [];
        
        if (fs.existsSync(produtosFilePath)) {
            const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
            produtos = JSON.parse(produtosData);
        }

        // Ordenar por data de criação (mais novos primeiro)
        produtos.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));

        res.render('todos-produtos', {
            usuario: req.session.user,
            produtos: produtos
        });

    } catch (error) {
        console.error("Erro ao listar todos os produtos:", error);
        res.status(500).send("Erro interno");
    }
};

// Buscar produtos por termo (para funcionalidade de busca)
exports.buscar = (req, res) => {
    try {
        const termo = req.query.q ? req.query.q.toLowerCase() : '';

        if (!termo) {
            return res.redirect('/');
        }

        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        let produtos = [];
        
        if (fs.existsSync(produtosFilePath)) {
            const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
            const todosProdutos = JSON.parse(produtosData);
            
            // Filtrar produtos que contêm o termo no nome ou descrição
            produtos = todosProdutos.filter(p => 
                p.nome.toLowerCase().includes(termo) || 
                p.descricao.toLowerCase().includes(termo)
            );
        }

        res.render('resultados-busca', {
            usuario: req.session.user,
            produtos: produtos,
            termo: req.query.q
        });

    } catch (error) {
        console.error("Erro na busca:", error);
        res.status(500).send("Erro interno");
    }
};