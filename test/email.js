const chai = require('chai');
const email = require('slidetherapy/email');

describe('Email', () => {
  describe('Check Identity Policy', () => {
    it('should be allowed to send email', done => {
      email.getIdentityPolicy().then(policy => {
        try {
          chai.expect(policy.Effect).to.equal('Allow');
          chai.expect(policy.Action).to.include('ses:SendEmail');
          done();
        } catch (e) {
          done(e);
        }
      }).catch(done);
    });
  });
});
