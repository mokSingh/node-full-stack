const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Icecream_31', {dialect: 'mysql', host: 'localhost'});

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'Icecream_31'
// });

module.exports = sequelize;