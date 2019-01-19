const request = require('request-promise-native');
const logger = require('../utils/logger')('jumpcloud');
const config = require('../../config');

const API_KEY = config.jumpcloud.apiKey;
const CREATE_SYSTEM_USER_URI = `${config.jumpcloud.uri}/systemusers`;

module.exports = {
  /**
   * Create a user in Jumpcloud
   * @param {string} username
   * @param {string} email
   * @param {string} firstname
   * @param {string} lastname
   * @return {Promise<object>}
   */
  async create(username, email, firstname, lastname) {
    try {
      const account = await request.post(CREATE_SYSTEM_USER_URI, {
        json: {
          username,
          email,
          firstname,
          lastname,
        },
        headers: {
          'x-api-key': API_KEY,
        }
      });

      logger.info({
        account,
      }, 'Account created successfully in Jumpcloud');

      return account;
    } catch (err) {
      logger.error({err}, 'Error while creating an account');
      throw err;
    }
  },
};