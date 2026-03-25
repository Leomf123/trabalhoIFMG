const Produto = require("../models/ProdutosModel");

// ── Formulário criar produto ───────────────────────────────────────────────
exports.createForm = (req, res) => {
  res.render("create");
}

// ── Criar produto ──────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {

    const produto = new Produto(req.body);
    const novoProduto = await produto.register(req.params.id);

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
