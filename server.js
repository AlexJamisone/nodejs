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
const multer = require('multer')
//MongoDb Url

const MONGODB_URL = 'mongodb+srv://rootjam:9Fbav1XY5amuwjEX@cluster0.haxu3.mongodb.net/shop';


// App
const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URL,
    collection: 'session'
});
const csurfProt = csurf()
const today = new Date()
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + file.originalname);
    }
});

const fileFilterMec = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
        ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
};

// Teamplate engine
app.set('view engine', 'pug');
app.set('views', './views')

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilterMec}).single('image'))

//Static dirname for CSS, JS, IMG
app.use(express.static(path.join(__dirname, 'public')))
app.use("/images", express.static(path.join(__dirname, 'images')))

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
    res.locals.isAutenticated = req.session.isLoggedIn;
    res.locals.csurfToken = req.csrfToken();
    next()
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err))
        });
});




//Requests


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Error Req

app.get('/500', errorControllers.get500)
app.use(errorControllers.get404);
app.use((error, req, res, next) => {
    //res.redirect('/500')
    res.status(500).render('500', {
        pageTitle: 'Database Error',
        path: '/500',
        isAutenticated: req.session.isLoggedIn
    })
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