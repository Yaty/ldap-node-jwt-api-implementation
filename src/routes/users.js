const express = require('express');
const user = require('../controller/user');
const jwt = require('../controller/jwt');
const router = new express.Router();

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

router.get('/news', function(req, res) {
  const token = req.query.access_token;
  const user = jwt.verify(token);
  const data = [{
    name: 'News pour le MainGroup!',
  }];

  if (user.groups.includes('Groupe 1')) {
    data.push({
      name: 'News pour le groupe 1!',
    });
  }

  if (user.groups.includes('Groupe 2')) {
    data.push({
      name: 'News pour le groupe 2!',
    });
  }

  res.json(data);
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
      id: createdUser.id,
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
