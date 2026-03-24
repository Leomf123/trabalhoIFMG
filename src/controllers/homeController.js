const Usuarios = require('../models/UsuariosModel');

//Por get
exports.index = async (req, res, next) => {
    try{
        const usuarios = await Usuarios.buscarUsuarios();

        return res.render('index', { 
            usuarios: usuarios || []
        });
    }catch(e){
        console.error(e);
        res.render('404');
    }
}