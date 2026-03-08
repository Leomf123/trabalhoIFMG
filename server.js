const express = require('express');
const app = express();
const routes = require('./router');

app.use(express.urlencoded({ extended: true}));

app.use(routes);

app.use((req, res, next) => {
    res.status(404).send('Erro 404 - Página não encontrada!');
})

const porta = 3000;
app.listen(porta,() => {
    console.log("Servidor execuntado em: ");
    console.log("http://127.0.0.1:" + porta);
} );