const Usuario = require('../models/UsuariosModel');

exports.index = function (req, res) {
    return res.render('editarPerfil', {
        usuario: {}
    });
};

exports.editIndex = async function (req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.render('404');

        const usuario = await Usuario.buscarPorId(id);
        if (!usuario) return res.render('404');

        res.render('editarPerfil', { usuario });

    } catch (e) {
        console.error(e);
        res.render('404');
    }
};

exports.edit = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.render('404');
        

        const usuario = new Usuario(req.body);
        await usuario.edit(id);


        if (usuario.errors.length > 0) {
            req.flash('errors', usuario.errors);
            return req.session.save(() => res.redirect(`/perfil/index/${id}`));
        }


        req.flash('success', 'Usuario editado com sucesso!');
        req.session.save(() => res.redirect(`/perfil/index/${id}`));
        return;
    } catch (e) {
        console.error(e);
        return res.render('404');
    }
};

