const { csrfSync } = require('csrf-sync');

const {
    generateToken, // gera o token para o cliente
    csrfSynchronisedProtection, // middleware para proteger as rotas
} = csrfSync({
    getTokenFromRequest: (req) => req.body['CSRFToken'] || req.headers['x-csrf-token']
});

//Injetar token nas views
exports.injectCsrfToken = (req, res, next) => {
    res.locals.csrfToken = generateToken(req);
    next();
}

exports.csrfProtection = csrfSynchronisedProtection;

// middleware para checagem de erro do CSRF Token
exports.checkCsrfError = (err, req, res, next) => {
    if(err && err.code === 'EBADCSRFTOKEN' || err.message === 'invalid csrf token'){
        return res.status(404).render('404');
    }
}

module.exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
}
