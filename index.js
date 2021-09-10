const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const session = require('express-session');
const greeting = require('./greetings');
const routes = require('./routes/greetingsRoutes');

const app = express();

const pg = require('pg');
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
const local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  // eslint-disable-next-line no-unused-vars
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/my_greetings';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const greetings = greeting(pool);

const GreetingRoutes = routes(greetings);

const handlebarSetup = exphbs({
  partialsDir: './views/partials',
  viewPath: './views',
  layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(flash());

app.use(session({
  secret: 'the-greet ',
  resave: false,
  saveUninitialized: true
}));

app.get('/', GreetingRoutes.display);

app.post('/greetings', GreetingRoutes.displayAdd);
app.get('/greeted', GreetingRoutes.stored);
app.get('/counter/:name', GreetingRoutes.nameCounter);
app.post('/reset', GreetingRoutes.letReset);

const PORT = process.env.PORT || 3999;

app.listen(PORT, function () {
  console.log('App started running');
});
