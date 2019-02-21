const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');

const shopController = require('./controllers/shop');

const isAuth = require('./middleware/is-auth');

const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://Ahmad:ahmad0991445186@cluster0-yqjps.mongodb.net/shop?retryWrites=true';

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

// To protect my app from CSRF attack
const csrfProtection = csrf();

// Multer configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // to tell multer it's ok to store it
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

// store the image depending on types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Initialize the flash message
app.use(flash());

/////////////////////////////////////////////////////
// Add and register EJS engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));

// Helper to work wih files [file, image, ...]
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

// To Access the public folder which contains all CSS - JS files
app.use(express.static(path.join(__dirname, 'public')));
// To Access the images folder which contains all images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Initialize the sessions through connect-mongodb-session package
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});

app.post('/create-order', isAuth, shopController.postOrder);

app.use(csrfProtection);
// Set Local variable to all routes
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
