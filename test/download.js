const config = require('../config');
const Database = require('slidetherapy/db');
const download = require('slidetherapy/download');
const OrderService = require('slidetherapy/services/order');

const OID = 1;
const SKU = 1;
const EMAIL = 'test-slide-therapy@jimmybyrum.com';
const TOKEN = 'tok_visa';

describe('Download', () => {
  let orderService, dbConnection, testOrder;

  before(done => {
    dbConnection = new Database('slidetherapytestdownload', () => {
      orderService = new OrderService(dbConnection.db);
      let skuData = config.skus[SKU];
      orderService.saveOrder(TOKEN, OID, skuData, EMAIL).then(order => {
        testOrder = order;
        done();
      }).catch(done);
    });
  });

  after(done => {
    dbConnection.drop().then(() => {
      return dbConnection.close().then(() => {
        done();
      });
    }).catch(done);
  });

  describe('Signed URL', () => {
    it('should get signed url', done => {
      download(orderService, testOrder.oid, testOrder.token, testOrder.created.valueOf()).then(url => {
        // console.log(url);
        done();
      }).catch(done);
    });
  });
});
