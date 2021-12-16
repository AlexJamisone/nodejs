//Express
const path = require('path');
const express = require('express');

// Controllers MVC
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require('./controllers/error');


// Sequlize and models
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

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
    User.findByPk(1)
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

app.use(errorControllers.get404);

//Relationship

Product.belongsTo(User, {constraints: true, onDelet: 'CASCADE'})
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User)
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User),
User.hasMany(Order),
Order.belongsToMany(Product, {through: OrderItem})

//Sequelize DB and listener PORT: 8000

sequelize
    .sync()
    .then(result => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({name: 'Alex', email: 'text@gmail.com'})
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        return user.createCart()
    })
    .then(cart => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err)
    });