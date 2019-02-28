const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
  /**
   * Create a signed JWT
   * @param {object} payload
   * @return {string}
   */
  create(payload) {
    return jwt.sign(payload, config.jwt.secret);
  },
  /**
   * Verify token
   * @param {string} token
   * @return {object}
   */
  verify(token) {
    return jwt.verify(token, config.jwt.secret);
  },
};
