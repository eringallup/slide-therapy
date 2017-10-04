// const config = require('../config');
const chai = require('chai');
const email = require('../server/email');
// const Database = require('../server/db');
// const { Order } = require('../server/schema/order');

// const OID = 1;
// const SKU = 1;
// const EMAIL = 'test-slide-therapy@jimmybyrum.com';
// const TOKEN = 'tok_visa';

describe('Email', () => {
  let db, testOrder;

  // before(done => {
  //   db = new Database('slidetherapytestemail', () => {
  //     let skuData = config.skus[SKU];
  //     db.saveOrder(TOKEN, OID, skuData, EMAIL).then(order => {
  //       testOrder = order;
  //       done();
  //     }).catch(done);
  //   });
  // });

  // after(done => {
  //   db.drop().then(() => {
  //     return db.close().then(() => {
  //       done();
  //     });
  //   }).catch(done);
  // });

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

  // describe('Send', () => {
  //   it('should send email', done => {
  //     email.sendFile(db, OID).then(() => {
  //       done();
  //     }).catch(done);
  //   });
  // });
});
