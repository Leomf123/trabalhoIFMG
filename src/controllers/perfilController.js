exports.index = (req, res) => {
    // Verificar se usuário está logado
    if (!req.session.user) {
        req.flash('errors', 'Você precisa estar logado para acessar o perfil');
        return res.redirect('/login/index');
    }

    // Passar dados do usuário para a view
    res.render('perfilView', { 
        usuario: req.session.user 
    });
}