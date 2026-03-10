const Usuario = require('../models/UsuariosModel');

//Por get
exports.index = (req, res) => {
    res.render('login');
}

//Por post
exports.register = async (req, res) => {
    try{
        const usuario = new Usuario(req.body);
        const novo = await usuario.register();
        console.log('Usuario cadastrado');
        return res.redirect(`/usuario/${novo.id}`);
    } catch(e){
        console.log(e);
        return res.status(404).render('404');
    }
}

exports.sucess = (req, res) => {
    console.log('Id: ', req.params.id);
    //res.send('Usuário cadastrado com sucesso!');
    res.render('cadastrarUsuarioSucesso');
}