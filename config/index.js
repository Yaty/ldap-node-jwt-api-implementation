module.exports = {
  ldap: {
    password: process.env.LDAP_PASSWORD,
    baseDN: `ou=Users,o=${process.env.LDAP_ORG_ID},dc=jumpcloud,dc=com`,
    url: 'ldaps://ldap.jumpcloud.com:636',
    username: process.env.LDAP_USERNAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  jumpcloud: {
    apiKey: process.env.JUMPCLOUD_API_KEY,
    uri: 'https://console.jumpcloud.com/api',
  },
};
