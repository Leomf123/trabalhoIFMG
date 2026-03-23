const ProdutoModel = require('../models/ProdutoModel');

exports.renderEditForm = async (req, res) => {
    try {
        const produtoId = Number(req.params.id);

        const produto = await ProdutoModel.findById(produtoId);

        if (!produto) {
            return res.status(404).send("Produto não encontrado");
        }

        res.render('editarProduto', {
            produto,
            csrfToken: req.csrfToken(),
            messages: req.flash()
        });

    } catch (error) {
        console.error("Erro ao carregar formulário de edição:", error);
        res.status(500).send("Erro interno do servidor.");
    }
};

exports.updateProduto = async (req, res) => {
    try {
        const produtoId = req.params.id;

        const { nome, descricao, preco } = req.body;

        // validação simples
        if (!nome || !preco) {
            req.flash('error', 'Nome e preço são obrigatórios');
            return res.redirect(`/produtos/editar/${produtoId}`);
        }

        await ProdutoModel.update(produtoId, {
            nome,
            descricao,
            preco
        });

        req.flash('success', 'Produto atualizado com sucesso');

        res.redirect('/produtos/editar/1');

    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        res.status(500).send("Erro ao atualizar produto.");
    }
};