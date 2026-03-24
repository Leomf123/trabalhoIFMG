const Produto = require("../models/ProdutosModel");

// ── Formulário criar produto ───────────────────────────────────────────────
exports.createForm = (req, res) => {
  res.render("create");
}

// ── Criar produto ──────────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {

    const produto = new Produto(req.body);
    const novoProduto = await produto.register();

    if (produto.errors.length > 0) {
      req.flash('errors', produto.errors);
      return req.session.save(() =>
        res.redirect(req.get("Referrer") || "/create")
      );
    }

    // Redireciona para edição do contato recém-criado
    req.flash('success', `Produto cadastrado com sucesso! ID: ${novoProduto.id}`);
    return req.session.save(() =>
      //res.redirect(`/produto/index/${novoProduto.id}`) levar pra editar
      res.redirect('/create')
    );

  } catch (e) {
    console.error(e);
    return res.render('404');
  }

}
