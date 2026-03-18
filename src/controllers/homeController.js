const fs = require('fs');
const path = require('path');
const { getCategorias } = require('./produtoAdcController');

// Por get
exports.index = (req, res, next) => {
    try {
        // Buscar produtos do arquivo JSON
        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        let produtos = [];
        
        if (fs.existsSync(produtosFilePath)) {
            const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
            produtos = JSON.parse(produtosData);
        }

        // Lista de categorias com imagens
        const categorias = [
            { nome: 'Café da manhã', imagem: '/img/categorias/cafe-da-manha.jpg', icon: 'bi-cup-hot-fill' },
            { nome: 'Doces', imagem: '/img/categorias/doces.jpg', icon: 'bi-cake-fill' },
            { nome: 'Salgados', imagem: '/img/categorias/salgados.jpg', icon: 'bi-egg-fry' },
            { nome: 'Bebidas', imagem: '/img/categorias/bebidas.jpg', icon: 'bi-cup-straw' },
            { nome: 'Descartáveis', imagem: '/img/categorias/descartaveis.jpg', icon: 'bi-box-fill' }
        ];

        // Agrupar produtos por categoria
        const produtosPorCategoria = {};
        categorias.forEach(cat => {
            produtosPorCategoria[cat.nome] = produtos.filter(p => p.categoria === cat.nome).slice(0, 4); // Máx 4 produtos por categoria
        });

        res.render('index', { 
            usuario: req.session.user,
            categorias: categorias,
            produtosPorCategoria: produtosPorCategoria,
            todosProdutos: produtos
        });
    } catch (error) {
        console.error("Erro ao carregar home:", error);
        res.render('index', { 
            usuario: req.session.user,
            categorias: [],
            produtosPorCategoria: {},
            todosProdutos: []
        });
    }
}