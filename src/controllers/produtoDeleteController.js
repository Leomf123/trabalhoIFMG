// Deletar produto
exports.deleteProduto = (req, res) => {
    try {
        // Verificar se usuário está logado
        if (!req.session.user) {
            req.flash('errors', 'Você precisa estar logado para deletar produtos');
            return res.redirect('/login/index');
        }

        const produtoId = req.params.id;

        // TODO: Deletar do banco de dados quando estiver pronto
        // Aqui você faria: await db.run('DELETE FROM produtos WHERE id = ? AND usuario_id = ?', [produtoId, req.session.user.id]);

        console.log(`Produto ${produtoId} deletado pelo usuário ${req.session.user.id}`);

        // Simular verificação de propriedade do produto
        // Em produção, você verificaria se o produto pertence ao usuário antes de deletar

        req.flash('success', 'Produto deletado com sucesso!');
        return res.redirect('/meus-produtos');

    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        req.flash('errors', 'Erro ao deletar produto');
        return res.redirect('/meus-produtos');
    }
};

// Rota para confirmar deleção (opcional - pode ser usado para página de confirmação)
exports.confirmDelete = (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login/index');
        }

        const produtoId = req.params.id;
        
        // TODO: Buscar produto do banco de dados
        const produtoFake = {
            id: produtoId,
            nome: "Brownie de Exemplo",
            descricao: "Descrição do produto",
            preco: 10.00
        };

        res.render('confirmar-delecao', { 
            produto: produtoFake,
            usuario: req.session.user
        });

    } catch (error) {
        console.error("Erro ao carregar confirmação:", error);
        res.redirect('/meus-produtos');
    }
};