const express = require('express');
const path = require('path');
const {connect} = require('./src/database/connection');
const routes = require('./routes');
const app = express();

const {middleawareGlobal} = require('./src/middlewares/middlewares');

app.use(express.urlencoded({ extended: true}));
app.use(middleawareGlobal);
app.use(routes);

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//Rota 404
app.use((req, res, next) => {
    res.status(404).send('Erro 404 - Página não encontrada!');
})

const porta = 3000;
app.listen(porta,() => {
    console.log("Servidor execuntado em: ");
    console.log("http://127.0.0.1:" + porta);
    connect();
} );