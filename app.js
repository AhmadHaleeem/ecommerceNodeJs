// const http = require('http');
const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const db = require('./util/database');

// add express handlebars
// const expressHbs = require('express-handlebars');

const app = express();

///////////////////////////////////////////////////
// Register express-handlebars template engine
// app.engine(
//   'hbs',
//   expressHbs({
//     layoutsDir: 'views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs',
//   })
// );
// app.set('view engine', 'hbs');
// app.set('views', 'views');

//////////////////////////////////////////////////////
// add pug engine And register pug js
// app.set('view engine', 'pug');
// app.set('views', 'views');

/////////////////////////////////////////////////////
// Add and register EJS engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404);

app.listen(3000);
// const server = http.createServer(app);

// server.listen(3000);
