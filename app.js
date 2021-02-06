const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>')
})

app.listen(3333);