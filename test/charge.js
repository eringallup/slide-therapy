const Database = require('../server/db');
const charge = require('../server/charge');

const SKU = 1;
const EMAIL = 'test-slide-therapy@jimmybyrum.com';
const TOKEN = 'tok_visa';

describe('Charge', () => {
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

  describe('Payment', () => {
    it('should charge successfully', done => {
      charge(db, TOKEN, SKU, EMAIL).then(order => {
        done();
      }).catch(done);
    });
  });
});
