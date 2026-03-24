const validator = require("validator");
const Product = require("../models/productModel");

// ── Listar todos ───────────────────────────────────────────────────────────
function index(req, res) {
  const products = Product.getAll();
  res.render("index", { products });
}

// ── Formulário criar produto ───────────────────────────────────────────────
function createForm(req, res) {
  res.render("create", { error: null });
}

// ── Criar produto ──────────────────────────────────────────────────────────
function create(req, res) {
  const { name, price } = req.body;

  if (!name || !validator.isLength(name.trim(), { min: 2, max: 100 })) {
    return res.render("create", {
      error: "Nome do produto deve ter entre 2 e 100 caracteres.",
    });
  }

  if (!price || !validator.isFloat(String(price), { min: 0 })) {
    return res.render("create", {
      error: "Preço deve ser um número positivo.",
    });
  }

  Product.create({
    name: validator.escape(name.trim()),
    price: parseFloat(price).toFixed(2),
  });

  res.redirect("/");
}

// ── Formulário editar produto ──────────────────────────────────────────────
function editForm(req, res) {
  const product = Product.getById(req.params.id);
  if (!product) return res.status(404).render("404");
  res.render("edit", { product, error: null });
}

// ── Atualizar produto ──────────────────────────────────────────────────────
function update(req, res) {
  const { name, price } = req.body;

  if (!name || !validator.isLength(name.trim(), { min: 2, max: 100 })) {
    const product = Product.getById(req.params.id);
    return res.render("edit", {
      product,
      error: "Nome do produto deve ter entre 2 e 100 caracteres.",
    });
  }

  if (!price || !validator.isFloat(String(price), { min: 0 })) {
    const product = Product.getById(req.params.id);
    return res.render("edit", {
      product,
      error: "Preço deve ser um número positivo.",
    });
  }

  Product.update(req.params.id, {
    name: validator.escape(name.trim()),
    price: parseFloat(price).toFixed(2),
  });

  res.redirect("/");
}

// ── Deletar produto ────────────────────────────────────────────────────────
function remove(req, res) {
  Product.remove(req.params.id);
  res.redirect("/");
}

module.exports = { index, createForm, create, editForm, update, remove };
