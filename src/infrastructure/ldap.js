const LdapAuth = require('ldapauth-fork');
const config = require('../../config');
const logger = require('../utils/logger')('ldap');

const BASE_DN = config.ldap.baseDN;

const auth = new LdapAuth({
  url: config.ldap.url,
  bindDN: `uid=${config.ldap.username},${BASE_DN}`,
  bindCredentials: config.ldap.password,
  searchBase: BASE_DN,
  searchFilter: '(uid={{username}})',
  log: logger,
});

module.exports = {
  /**
   * Authenticate in LDAP
   * @param {string} username
   * @param {string} password
   * @return {Promise<boolean|object>} false if unauthenticated, user otherwise
   */
  authenticate(username, password) {
    return new Promise((resolve, reject) => {
      auth.authenticate(username, password, function(err, user) {
        if (err) {
          if (err.name === 'InvalidCredentialsError') {
            logger.info(`Wrong password for user ${username}`);
            return resolve(false);
          }

          if (err === `no such user: "${username}"`) {
            logger.info(`User not found : ${username}`);
            return resolve(false);
          }

          logger.error({err}, 'Error while comparing a password in LDAP');
          return reject(err);
        }

        logger.info(`Good password for user ${username}`);
        resolve(user);
      });
    });
  },
};
