module.exports = {
  ldap: {
    password: process.env.LDAP_PASSWORD,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  jumpcloud: {
    apiKey: process.env.JUMPCLOUD_API_KEY,
    uri: 'https://console.jumpcloud.com/api',
  },
};
