module.exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    // ALTERAÇÃO Christian: Disponibiliza session completa para as views
    res.locals.session = req.session;
    res.locals.user = req.session.usuario;
    next();
}