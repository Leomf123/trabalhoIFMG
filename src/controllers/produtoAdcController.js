const fs = require('fs');
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
            categorias: categorias, // Passando categorias para a view
            errors: req.flash('errors'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error("Erro ao carregar formulário:", error);
        res.status(500).send("Erro interno do servidor.");
    }
};

// Adicionar novo produto
exports.addProduto = (req, res) => {
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

        // Gerar ID temporário (em produção, viria do banco de dados)
        const novoId = Date.now();

        const novoProduto = {
            id: novoId,
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: parseFloat(preco),
            categoria: categoria,
            imagem: `/img/categorias/${categoria.toLowerCase().replace(/\s+/g, '-')}.jpg`, // Caminho da imagem
            usuario_id: req.session.user.id,
            usuario_nome: req.session.user.nome || 'Usuário',
            data_criacao: new Date().toISOString()
        };

        // TODO: Salvar no banco de dados quando estiver pronto
        
        // Salvar em arquivo JSON acumulativo
        const produtosFilePath = path.join(__dirname, '..', '..', 'produtos.json');
        
        let produtos = [];
        
        // Verificar se o arquivo já existe
        if (fs.existsSync(produtosFilePath)) {
            // Ler produtos existentes
            const produtosData = fs.readFileSync(produtosFilePath, 'utf8');
            produtos = JSON.parse(produtosData);
        }
        
        // Adicionar novo produto à lista
        produtos.push(novoProduto);
        
        // Salvar lista atualizada no arquivo
        fs.writeFileSync(
            produtosFilePath,
            JSON.stringify(produtos, null, 2),
            'utf8'
        );

        console.log('Novo produto adicionado:', novoProduto);

        req.flash('success', 'Produto adicionado com sucesso!');
        return res.redirect('/meus-produtos');

    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        req.flash('errors', 'Erro ao adicionar produto');
        return res.redirect('/produtos/adicionar');
    }
};

// Exportar categorias para uso em outros controllers
exports.getCategorias = () => categorias;