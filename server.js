const express = require('express');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const flash = require('connect-flash');
const { connect } = require('./src/database/connection');
const routes = require('./routes');
const { middlewareGlobal } = require('./src/middlewares/middlewares');

const app = express();

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'fgsgsfdgsfdgsfdgsfhnmjb',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
        db: 'session.sqlite',
        dir: './database'
    }),
    cookie: {
        maxAge: 100 * 60 * 60 * 24 * 7, // 7 dias em milisegundos
        httpOnly: true,
        secure: false // Mude para true se estiver usando HTTPS
    }
}));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Para suportar JSON no body das requisições

// Arquivos estáticos (CSS, imagens, etc)
app.use(express.static('public'));

// Flash messages
app.use(flash());

// Middleware global (seus middlewares personalizados)
app.use(middlewareGlobal);

// Rotas
app.use(routes);

// Configuração da view engine
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Rota 404 - Deve ser a última rota
app.use((req, res, next) => {
    res.status(404).render('404');
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro no servidor:', err);
    res.status(500).render('500', { error: err.message });
});

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
    console.log("Servidor executando em: ");
    console.log(`http://127.0.0.1:${porta}`);
    console.log(`http://localhost:${porta}`);
    connect();
});