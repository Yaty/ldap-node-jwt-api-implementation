const bunyan = require('bunyan');
const bformat = require('bunyan-format');
const formatOut = bformat({
  outputMode: 'short',
});

const logger = bunyan.createLogger({
  name: 'api-auth',
  stream: formatOut,
  level: bunyan.TRACE,
});

/**
 * Create a logger
 * @param {string} name
 * @return {object}
 */
module.exports = function(name) {
  return logger.child({
    loggerName: name,
  });
};
