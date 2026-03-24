const Usuario = require('../models/UsuariosModel');

//Por get
exports.index = (req, res) => {
    // ALTERAÇÃO Christian: Verifica session.usuario (padrão usado nas rotas)
    if(req.session.usuario){
        return res.render('login-logado');
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
        
        // ALTERAÇÃO Christian: Busca dados completos do usuário para a sessão
        const userData = await Usuario.buscarPorId(usuario.user.id);
        
        //regenerar a sessão para evitar session fixation
        req.session.regenerate(err => {
            if(err){
                console.error(err);
                return res.render('404');
            }

            // ALTERAÇÃO Christian: Sessão com dados completos do usuário
            req.session.usuario = {
                id: usuario.user.id,
                email: usuario.user.email,
                nome: userData.nome,
                nomeLoja: userData.nomeLoja,
                descricaoLoja: userData.descricaoLoja
            }
            
            req.flash('success', 'Login realizado com sucesso!');
            return req.session.save(() => {
                res.redirect('/meus-produtos'); // ALTERAÇÃO Christian: Redireciona para Central da Loja
            });
        });

    }catch(e){
        console.error(e);
        return res.render('404');
    }
}