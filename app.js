const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const errorController = require('./controllers/error');

// const mongoConnect = require('./util/database').mongoConnect;

const User = require('./models/user');

const app = express();

/////////////////////////////////////////////////////
// Add and register EJS engine
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Just to store user data as default
app.use((req, res, next) => {
  User.findById('5c5da68f904e3339744f377d')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(userRoutes);

app.use(errorController.get404);

mongoose
  .connect('mongodb+srv://Ahmad:ahmad0991445186@cluster0-yqjps.mongodb.net/shop?retryWrites=true')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Ahmad',
          email: 'test@test.nl',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => console.log(err));
