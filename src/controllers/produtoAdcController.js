const fs = require('fs');
const path = require('path');

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

        const { nome, descricao, preco } = req.body;

        // Validações básicas
        if (!nome || !descricao || !preco) {
            req.flash('errors', 'Todos os campos são obrigatórios');
            return res.redirect('/produtos/adicionar');
        }

        if (isNaN(preco) || preco <= 0) {
            req.flash('errors', 'Preço deve ser um número válido maior que zero');
            return res.redirect('/produtos/adicionar');
        }

        // Gerar ID temporário (em produção, viria do banco de dados)
        const novoId = Date.now();

        const novoProduto = {
            id: novoId,
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: parseFloat(preco),
            usuario_id: req.session.user.id,
            data_criacao: new Date().toISOString()
        };

        // TODO: Salvar no banco de dados quando estiver pronto
        // Por enquanto, salva em um arquivo JSON para testes
        const filePath = path.join(__dirname, '..', '..', 'novo_produto.json');
        
        // Em produção, você adicionaria ao banco de dados
        // Aqui estamos apenas simulando salvando em arquivo
        fs.writeFileSync(
            filePath,
            JSON.stringify(novoProduto, null, 2),
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