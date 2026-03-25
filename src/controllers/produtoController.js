const Produto = require("../models/ProdutosModel");

// ── Formulário criar produto ───────────────────────────────────────────────
exports.createForm = (req, res) => {
  res.render("create");
}

// ── Criar produto ──────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {

    const usuarioId = req.session.user.id;

    const produto = new Produto(req.body);
    const novoProduto = await produto.register(usuarioId);

    if (produto.errors.length > 0) {
      req.flash('errors', produto.errors);
      return req.session.save(() =>
        res.redirect(req.get("Referrer") || "/create")
      );
    }

    // Redireciona para edição do produto recém-criado
    req.flash('success', `Produto cadastrado com sucesso! ID: ${novoProduto.id}`);
    return req.session.save(() =>
      res.redirect('/create')
    );

  } catch (e) {
    console.error(e);
    return res.render('404');
  }

}


//Controllers editar Produto
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
}


// Listar produtos do usuário logado
exports.index = async (req, res) => {
    try {

        const usuarioId = req.session.user.id;

        const produtos = await Produto.buscarProdutos(usuarioId);

        return res.render('meus-produtos', {
            produtos: produtos || []
        });

    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        req.flash('errors', 'Erro ao carregar produtos');
        return res.redirect('/');
    }
};


// Deletar produto
exports.deleteProduto = async (req, res) => {
     try {

        const produtoId = req.params.id;
        if (!produtoId) return res.render('404');

        const produto = await Produto.buscarPorId(produtoId);

        if (!produto) {
            req.flash('errors', 'Produto não encontrado');
            return res.redirect('/meus-produtos');
        }

        const produtoDeletado = await Produto.delete(produtoId);
        if (!produtoDeletado || produtoDeletado.changes === 0) {
            return res.render('404');
        }

        req.flash('success', 'Produto deletado com sucesso!');
        req.session.save(() => res.redirect('/meus-produtos'));
        return;

    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        req.flash('errors', 'Erro ao deletar produto');
        return res.redirect('/meus-produtos');
    }
};
