module.exports = {
  /**
   * Generate a random string for testing purposes
   * @return {string}
   */
  randomString() {
    return 'a' + Math.random().toString().substr(2);
  },
};
