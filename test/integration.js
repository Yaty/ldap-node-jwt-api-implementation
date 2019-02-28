const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);
const request = require('request-promise-native');
const jwt = require('jsonwebtoken');
const {randomString} = require('./utils');
const {expect} = require('chai');
const config = require('../config');

const generateRandomUserData = () => ({
  username: randomString(),
  email: `${randomString()}@${randomString()}.com`,
  firstname: randomString(),
  lastname: randomString(),
});

const API_KEY = config.jumpcloud.apiKey;
const DELETE_SYSTEM_USER_URI = `${config.jumpcloud.uri}/systemusers`;

describe('User integration tests', function() {
  const createdUsers = [];

  after(() => {
    return Promise.all(createdUsers.map((userId) =>
      request.delete({
        uri: `${DELETE_SYSTEM_USER_URI}/${userId}`,
        headers: {
          'x-api-key': API_KEY,
        },
      })
    ));
  });

  it('should login', function(done) {
    api.post('/api/users/login')
      .send({
        username: 'user1',
        password: '**Super_Password01',
      })
      .expect(201, done);
  });

  it('should return a JWT', function(done) {
    api.post('/api/users/login')
      .send({
        username: 'user1',
        password: '**Super_Password01',
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.jwt).to.be.a('string');

        const payload = jwt.decode(res.body.jwt);

        expect(payload.username).to.equal('user1');
        expect(payload.mail).to.equal('contact@hdaroit.fr');
        expect(payload.fullname).to.equal('user1');
        expect(payload.iat).to.be.a('number');
        expect(payload.groups).to.deep.equal([
          'MainGroup',
        ]);

        done();
      });
  });

  it('should create', function(done) {
    const user = generateRandomUserData();

    api.post('/api/users')
      .send(user)
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        createdUsers.push(res.body.id);
        expect(res.body.username).to.equal(user.username);
        expect(res.body.firstname).to.equal(user.firstname);
        expect(res.body.lastname).to.equal(user.lastname);
        expect(res.body.email).to.equal(user.email);
        expect(res.body).to.not.have.property('password');
        expect(Object.keys(res.body)).to.have.lengthOf(5);
        done();
      });
  });
});
