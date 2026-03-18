const Usuario = require('../models/UsuariosModel');

//Por get
exports.index = (req, res) => {
    if(req.session.user){
        // Passa os dados do usuário para a view
        return res.render('login-logado', { 
            usuario: req.session.user 
        });
    }
    res.render('login');
}

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if(err){
            console.error(err);
            return res.render('404');
        }
        res.clearCookie('connect.sid');
        return res.redirect('/');
    });
}

//Por post
exports.register = async (req, res) => {
    try{
        const usuario = new Usuario(req.body);
        await usuario.register();

        if(usuario.errors.length > 0){
            req.flash('errors', usuario.errors);
            return req.session.save(() => {
                res.redirect('/login/index');
            });
        }

        req.flash('success', 'Usuário cadastrado com sucesso!');
        return req.session.save(() => {
            res.redirect('/login/index');
        });

    }catch(e){
        console.error(e);
        return res.render('404');
    }
}

exports.login = async (req, res) => {
    try{
        const usuario = new Usuario(req.body);
        await usuario.login();

        if(usuario.errors.length > 0){
            req.flash('errors', usuario.errors);
            return req.session.save(() => {
                res.redirect('/login/index');
            });
        }
        
        //regenerar a sessão para evitar session fixation
        req.session.regenerate(err => {
            if(err){
                console.error(err);
                return res.render('404');
            }

            req.session.user = {
                id: usuario.user.id,
                email: usuario.user.email,
                nome: usuario.user.nome || 'Usuário' // Adicionando nome se existir
            }
            req.flash('success', 'Login realizado com sucesso!');
            return req.session.save(() => {
                res.redirect('/login/index');
            });
        });

    }catch(e){
        console.error(e);
        return res.render('404');
    }
}