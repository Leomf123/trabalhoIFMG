const express = require('express');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const csurf = require('csurf');
const {connect} = require('./src/database/connection');
const app = express();
const flash = require('connect-flash');

app.use(express.urlencoded({ extended: true}));

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// usando para teste direto da pagina e checar de o servidor ta funcionando
app.get('/teste-direto', (req, res) => {
  res.send('server funcionando');
});


// SESSÃO (OBRIGATÓRIO antes do CSRF)
app.use(session({
  store: new SQLiteStore(),
  secret: 'segredo-super-seguro',
  resave: false,
  saveUninitialized: false
}));

// CSRF (DEPOIS da sessão)
const csrfProtection = csurf();
app.use(csrfProtection);

app.use(flash());
// disponibiliza token globalmente nas views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});


const routes = require('./routes');
app.use(routes);

//Rota 404
app.use((req, res, next) => {
    res.status(404).render('404');
})

const porta = 3000;
app.listen(porta,() => {
    console.log("Servidor execuntado em: ");
    console.log("http://127.0.0.1:" + porta);
    connect();
} );