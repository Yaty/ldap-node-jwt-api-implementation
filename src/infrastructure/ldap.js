const LdapAuth = require('ldapauth-fork');
const config = require('../../config');
const logger = require('../utils/logger')('ldap');

const BASE_DN = 'ou=Users,o=5c1b4554225be15e269b1dd0,dc=jumpcloud,dc=com';

const auth = new LdapAuth({
  url: 'ldaps://ldap.jumpcloud.com:636',
  bindDN: 'uid=Yaty,' + BASE_DN,
  bindCredentials: config.ldap.password,
  searchBase: BASE_DN,
  searchFilter: "(uid={{username}})",
  log: logger,
});

module.exports = {
  /**
   * Authenticate in LDAP
   * @param {string} username
   * @param {string} password
   * @return {Promise<boolean|object>} false if unauthenticated, the user otherwise
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
