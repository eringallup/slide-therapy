const config = require('../config');
const chai = require('chai');
const Database = require('slidetherapy/db');
const OrderService = require('slidetherapy/services/order');
const charge = require('slidetherapy/charge');

const SKU = 1;
const UID = null;
const EMAIL = 'test-slide-therapy@jimmybyrum.com';
const TOKEN = 'tok_visa';

describe('Database', () => {
  let testOid, testOrder;
  let orderService, dbConnection;

  before(done => {
    dbConnection = new Database('slidetherapytestdb', () => {
      orderService = new OrderService(dbConnection.db);
      done();
    });
  });

  after(done => {
    dbConnection.drop().then(() => {
      return dbConnection.close().then(() => {
        done();
      });
    }).catch(done);
  });

  describe('OID', () => {
    it('should return an oid', done => {
      orderService.getOid().then(oid => {
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
      orderService.getOrder(testOid).then(order => {
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
      orderService.saveOrder(TOKEN, testOid, skuData, EMAIL).then(order => {
        testOrder = order;
        done();
      }).catch(done);
    });

    it('should complete the order', done => {
      orderService.completeOrder(testOrder.oid, 'chargeDone1234567890').then(completedOrder => {
        if (!completedOrder || completedOrder.status !== 'complete') {
          return done(new Error('order not marked as complete', completedOrder));
        }
        done();
      }).catch(done);
    });
  });
});
