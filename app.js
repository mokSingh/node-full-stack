const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const User = require('./models/user');
const Product = require('./models/product');
const sequelize = require('./utils/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(error => {
        console.log('Some error occurred');
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);


// sync({force: true});
sequelize.sync().then(result => {
    return User.findByPk(1);  
}).then((user) => {
    if(!user) {
        return User.create({name: 'Max', email: 'test@email.com'})
    }
    return user;
    
}).then(user => {
    console.log(user);
    app.listen(3000);
}).catch(error => console.log(error));


