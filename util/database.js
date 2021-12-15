const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-js', 'root', '556839', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;