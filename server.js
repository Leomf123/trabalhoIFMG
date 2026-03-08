const express = require('express');
const app = express();



app.get('/', (req, res) => {
    res.send('Olá Mundo!');
});


app.use((req, res, next) => {
    res.status(404).send('Erro 404 - Página não encontrada!');
})

const porta = 3000;
app.listen(porta,() => {
    console.log("Servidor execuntado em: ");
    console.log("http://127.0.0.1:" + porta);
    console.log('Primeiro teste Denise');
    console.log('primeiro teste Antonio');
    console.log('primeiro Teste Wharley');
} );