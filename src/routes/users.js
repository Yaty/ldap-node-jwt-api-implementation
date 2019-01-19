const express = require('express');
const user = require('../controller/user');
const router = express.Router();

router.post('/login', async function(req, res, next) {
  try {
    res.status(201).json({
      jwt: await user.login(
        req.body.username,
        req.body.password,
      ),
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async function(req, res, next) {
  try {
    const createdUser = await user.create(
      req.body.username,
      req.body.email,
      req.body.firstname,
      req.body.lastname,
    );

    res.status(201).json({
      username: createdUser.username,
      firstname: createdUser.firstname,
      lastname: createdUser.lastname,
      email: createdUser.email,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
