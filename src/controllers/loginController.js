const Usuario = require('../models/UsuariosModel');

//Por get
exports.index = (req, res) => {
    res.render('login');
}

//Por post
exports.login = (req, res) => {

    const {email, senha} =  req.body;

    //Aqui que eu vou buscar no banco de dados pelo email e senha do body
    //e se encontrar retorno o do banco de dados pra associar com os da sessão
    const usuarioEncontrado = {
        id: 1,
        nome: 'Leonardo Macedo',
        email: 'leo@gmail.com'
    }

    req.session.usuario = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        logado: true
    };

    res.redirect('/login/dashboard');
}

exports.loginSucessOrError = (req, res) => {
    if(!req.session.usuario || !req.session.usuario.logado){
        return res.redirect('/login/index');
    }
    res.send(`Bem-vindo: ${req.session.usuario.nome}`);
}