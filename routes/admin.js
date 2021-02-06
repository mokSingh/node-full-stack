const express = require('express');
const path = require('path');
const pathDir = require('../utils/path');
const router = express.Router();

router.get('/add-product',(req, res, next) => {
    // res.send('<form action="/admin/submit" method="POST"><input type="text" name="title"><button type="submit">Send</button></form>');
    res.sendFile(path.join(pathDir, 'views', 'add-product.html'));
});

router.post('/submit', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;