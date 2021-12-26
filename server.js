//Express
const path = require('path');
const express = require('express');

// Controllers MVC
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require('./controllers/error');

//MongoDB

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')


// Parser
const bodyParser = require('body-parser');


// App
const app = express();

// Teamplate engine
app.set('view engine', 'pug');
app.set('views', './views')


app.use(bodyParser.urlencoded({extended: false}));

//Static dirname for CSS, JS
app.use(express.static(path.join(__dirname, 'public')))


//Requests

app.use((req, res, next) => {
    User.findById('61c723b49ae114008a8379e8')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err)
        });
});


app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorControllers.get404);

mongoConnect(() => {
    app.listen(8000)
});