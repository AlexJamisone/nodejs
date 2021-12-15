const path = require('path');
const express = require('express');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorControllers = require('./controllers/error')
const sequelize = require('./util/database')


const bodyParser = require('body-parser');

const app = express();


app.set('view engine', 'pug');
app.set('views', './views')


app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))


app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(errorControllers.get404);

sequelize
    .sync()
    .then(result => {
        //console.log(result)
        app.listen(8000)
    })
    .catch(err => {
        console.log(err)
    });

