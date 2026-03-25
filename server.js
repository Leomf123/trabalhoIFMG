require('dotenv').config();
const express = require('express');
const path = require('path');
const {connect} = require('./src/database/connection');
const routes = require('./routes');
const app = express();
const helmet = require('helmet');

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const flash = require('connect-flash');
const { checkCsrfError, injectCsrfToken, middlewareGlobal } = require('./src/middlewares/middlewares');

app.use(helmet());
app.use(session({
    secret: 'fgsgsfdgsfdgsfdgsfhnmjb',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({
        db: 'session.sqlite',
        dir: './database'
    }),
    cookie: {
        maxAge: 100 * 60 * 60 * 24 * 7, // 7 dias em milisegundos
        httpOnly: true
    }
}));
app.use(express.urlencoded({ extended: true}));

app.use(flash());
app.use(injectCsrfToken);
app.use(middlewareGlobal);
app.use(routes);

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(checkCsrfError);
//Rota 404
app.use((req, res, next) => {
    res.status(404).render('404');
})

const PORT = process.env.PORT || 3000
app.listen(PORT,() => {
    console.log("Servidor execuntado em: ");
    console.log("http://127.0.0.1:" + PORT);
    connect();
} );