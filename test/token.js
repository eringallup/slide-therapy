const config = require('../config');
const chai = require('chai');
const token = require('../server/token');

const OID = 1;
const TOKEN = 'tok_12385';
const CREATED = new Date().valueOf();

describe('JSON Web Token', () => {
  let jwtData = {
    oid: OID,
    token: TOKEN,
    created: CREATED
  };
  let jwt;

  it('should created a token that expires in one hour', done => {
    token.encrypt(jwtData, null, '1h').then(token => {
      jwt = token;
      try {
        chai.expect(jwt).to.be.a('string');
        done();
      } catch (err) {
        done(err);
      }
    }).catch(done);
  });

  it('should decrypt token', done => {
    token.decrypt(jwt, null).then(data => {
      try {
        chai.expect(data.oid).to.equal(OID);
        chai.expect(data.token).to.equal(TOKEN);
        chai.expect(data.created).to.equal(CREATED);
        done();
      } catch (err) {
        done(err);
      }
    }).catch(done);
  });

  it('should created a token that expires in 1ms', done => {
    token.encrypt(jwtData, null, '1ms').then(token => {
      try {
        jwt = token;
        chai.expect(token).to.be.a('string');
        setTimeout(done, 1);
      } catch (e) {
        done(e);
      }
    });
  });

  it('should fail due to jwt expired', done => {
    token.decrypt(jwt).then(data => {
      done(new Error('did not throw error'));
    }).catch(err => {
      try {
        chai.expect(err.message).to.equal('jwt expired');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('should fail due to invalid signature', done => {
    token.decrypt(jwt, '123').then(data => {
      done(new Error('did not throw error'));
    }).catch(err => {
      try {
        chai.expect(err.message).to.equal('invalid signature');
        done();
      } catch (e) {
        done(e);
      }
    });
  });
});
