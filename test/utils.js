const crypto = require('crypto');

module.exports = {
  /**
   * Generate a random string for testing purposes
   * @return {string}
   */
  randomString() {
    return crypto.randomBytes(12).toString('hex');
  },
};