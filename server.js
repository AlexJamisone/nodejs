//Express
const path = require('path');
const express = require('express');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const csurf = require('csurf')
const flash = require('connect-flash')

//Mongoose

const mongoose = require('mongoose');


// Controllers MVC / Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require('./controllers/error');
const authRoutes = require('./routes/auth')

//User

const User = require('./models/user')


// Parser
const bodyParser = require('body-parser');
//MongoDb Url

const MONGODB_URL = 'mongodb+srv://rootjam:9Fbav1XY5amuwjEX@cluster0.haxu3.mongodb.net/shop';


// App
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'session'
});
const csurfProt = csurf()

// Teamplate engine
app.set('view engine', 'pug');
app.set('views', './views')


app.use(bodyParser.urlencoded({extended: false}));

//Static dirname for CSS, JS
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
        secret: 'jamison', 
        resave: false, 
        saveUninitialized: false,
        store: store
    })
);

app.use(csurfProt);
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        });
});

app.use((req, res, next) => {
    res.locals.isAutenticated = req.session.isLoggedIn;
    res.locals.csurfToken = req.csrfToken();
    next()
});


//Requests


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Error Req

app.get('/500', errorControllers.get500)
app.use(errorControllers.get404);
app.use((error, req, res, next) => {
    res.redirect('/500')
});

//App LISTEN localhost://8000

mongoose
    .connect(MONGODB_URL)
    .then(result => {
        app.listen(8000)
    })
    .catch(err => {
        console.log(err)
    });