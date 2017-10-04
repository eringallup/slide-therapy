const config = require('../config');
const chai = require('chai');
const Database = require('../server/db');
const charge = require('../server/charge');

const SKU = 1;
const UID = null;
const EMAIL = 'test-slide-therapy@jimmybyrum.com';
const TOKEN = 'tok_visa';

describe('Database', () => {
  let testOid, testOrder;
  let db;

  before(done => {
    db = new Database('slidetherapytest', done);
  });

  after(done => {
    db.drop().then(() => {
      return db.close().then(() => {
        done();
      });
    }).catch(done);
  });

  describe('OID', () => {
    it('should return an oid', done => {
      db.getOid().then(oid => {
        try {
          testOid = oid;
          chai.expect(testOid).to.be.a('number');
          done();
        } catch (err) {
          done(err);
        }
      }, done);
    });
    it('should not be an existing order', done => {
      db.getOrder(testOid).then(order => {
        if (order && order.oid) {
          return done(new Error(`order exists with oid: ${testOid}`));
        }
        done();
      });
    });
  });

  describe('Order', () => {
    it('should return a new order', done => {
      let skuData = config.skus[SKU];
      db.saveOrder(TOKEN, testOid, skuData, EMAIL).then(order => {
        testOrder = order;
        done();
      }).catch(done);
    });

    it('should complete the order', done => {
      db.completeOrder(testOrder.oid, 'chargeDone1234567890').then(completedOrder => {
        if (!completedOrder || completedOrder.status !== 'complete') {
          return done(new Error('order not marked as complete', completedOrder));
        }
        done();
      }).catch(done);
    });
  });
});
