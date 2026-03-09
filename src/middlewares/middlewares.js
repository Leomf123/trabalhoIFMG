module.exports.middlewareHomeInicial = (req, res, next) => {
    console.log('Middleare Incial Home por get');
    next();
}

module.exports.middlewareHomeFinal = (req, res) => {
    console.log('Middleare Final Home por get');
}
