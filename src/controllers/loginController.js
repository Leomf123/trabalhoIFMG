const Usuario = require('../models/UsuariosModel');

//Por get
exports.index = (req, res) => {
    res.render('login');
}
