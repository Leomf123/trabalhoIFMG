const Produto = require('../models/ProdutosModel');

exports.renderEditForm = async (req, res) => {
    try {
        const produtoId = Number(req.params.id);
        if(!produtoId) res.render('404');

        const produto = await Produto.buscarPorId(produtoId);

        if (!produto) return res.render('404');
        

        res.render('editarProduto', { produto });

    } catch (error) {
        console.error("Erro ao carregar formulário de edição:", error);
        res.render('404');
    }
};

exports.updateProduto = async (req, res) => {
    try {
        const produtoId = req.params.id;
        if(!produtoId) res.render('404');

        const produto = new Produto(req.body);
        await produto.edit(produtoId);

        if (produto.errors.length > 0) {
            req.flash('errors', produto.errors);
            req.session.save(() => res.redirect(`/produtos/editar/${produtoId}`));
            return;
        }

        req.flash('success', 'Produto atualizado com sucesso!');
        req.session.save(() => res.redirect(`/produtos/editar/${produtoId}`));
        return;

    } catch (error) {
        console.error("Erro ao atualizar produto: ", error);
        return res.render('404');
    }
};
