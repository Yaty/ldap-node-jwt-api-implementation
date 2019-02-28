const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();

const logger = require('./utils/logger')('app');

app.use(morgan('tiny', {
  stream: {
    write(message) {
      logger.info(message.trim());
    },
  },
}));

app.use(cors());
app.use(express.static('./public/dist'));
app.use(bodyparser.json());
app.use('/api', require('./routes'));

app.use(function(err, req, res, next) {
  res.status(err.statusCode || 500).json(err);
});

module.exports = app;
