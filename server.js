//Express
const path = require('path');
const express = require('express');

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
    User.findById('61d6fb0102222df21402ca82')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        });
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorControllers.get404);

mongoose
    .connect(
        'mongodb+srv://rootjam:9Fbav1XY5amuwjEX@cluster0.haxu3.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Alex',
                        email: 'business.homeit@gmail.com',
                        cart: {
                            items: []
                        }
                    });
                    user.save()
                }
            })
        app.listen(8000)
    })
    .catch(err => {
        console.log(err)
    });