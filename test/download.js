const config = require('../config');
const Database = require('../server/db');
const charge = require('../server/charge');
const download = require('../server/download');
const { Order } = require('../server/schema/order');

const OID = 1;
const SKU = 1;
const EMAIL = 'test-slide-therapy@jimmybyrum.com';
const TOKEN = 'tok_visa';

describe('Download', () => {
  let db, testOrder;

  before(done => {
    db = new Database('slidetherapytest', () => {
      let skuData = config.skus[SKU];
      db.saveOrder(TOKEN, OID, skuData, EMAIL).then(order => {
        testOrder = order;
        done();
      }).catch(done);
    });
  });

  after(done => {
    db.drop().then(() => {
      return db.close().then(() => {
        done();
      });
    }).catch(done);
  });

  describe('Signed URL', () => {
    it('should get signed url', done => {
      download(db, testOrder.oid, testOrder.token, testOrder.created).then(url => {
        // console.log(url);
        done();
      }).catch(done);
    });
  });
});
