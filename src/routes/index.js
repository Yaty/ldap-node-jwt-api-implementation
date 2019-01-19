const express = require('express');
const router = new express.Router();

router.use('/users', require('./users'));

module.exports = router;
