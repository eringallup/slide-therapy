const Database = require('slidetherapy/db');
const OrderService = require('slidetherapy/services/order');
const charge = require('slidetherapy/charge');

const SKU = 1;
const EMAIL = 'test-slide-therapy@jimmybyrum.com';
const TOKEN = 'tok_visa';

describe('Charge', () => {
  let orderService, dbConnection;

  before(done => {
    dbConnection = new Database('slidetherapytestcharge', () => {
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

  describe('Payment', () => {
    it('should charge successfully', done => {
      charge(orderService, TOKEN, SKU, EMAIL).then(order => {
        done();
      }).catch(done);
    });
  });
});
