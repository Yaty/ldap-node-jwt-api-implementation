const ldap = require('../infrastructure/ldap');
const jumpcloud = require('../infrastructure/jumpcloud');
const jwt = require('./jwt');
const logger = require('../utils/logger')('UserController');

/**
 * UnauthorizedError
 */
class UnauthorizedError extends Error {
  /**
   * @constructor
   */
  constructor() {
    super();
    this.statusCode = 401;
    this.message = 'Unauthorized';
    this.code = 'UNAUTHORIZED';
  }
}

const getGroupName = (group) => group.split(',')
  .find((pair) => pair.startsWith('cn='))
  .substr(3);

module.exports = {
  /**
   * Login a user
   * @param {string} username
   * @param {string} password
   * @return {Promise<string>}
   */
  async login(username, password) {
    const user = await ldap.authenticate(username, password);

    if (user) {
      logger.info(`User ${username} logged successfully`);

      const userGroups = [];

      if (Array.isArray(user.memberOf)) {
        userGroups.push(...user.memberOf);
      } else {
        userGroups.push(user.memberOf);
      }

      return jwt.create({
        username: user.uid,
        mail: user.mail,
        fullname: user.cn,
        groups: userGroups.map(getGroupName),
      });
    }

    logger.info(`Login failed for user ${username}`);
    throw new UnauthorizedError();
  },
  /**
   * Create a user
   * @param {string} username
   * @param {string} email
   * @param {string} firstname
   * @param {string} lastname
   * @return {Promise<object>}
   */
  async create(username, email, firstname, lastname) {
    const user = await jumpcloud.create(
      username,
      email,
      firstname,
      lastname,
    );

    logger.info(`User ${username} created successfully`);
    return user;
  },
};
