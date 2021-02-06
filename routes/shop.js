const express = require('express');
const path = require('path');
const pathDir = require('../utils/path');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.sendFile(path.join(pathDir, 'views', 'shop.html'));
})

module.exports = router;