const skus = require('../skus.json');
const charge = require('slidetherapy/charge');

const OID = 1;
const SKU = 1;
const EMAIL = 'test-slide-therapy@jimmybyrum.com';
const TOKEN = 'tok_visa';

describe('Charge', () => {
  it('should charge successfully', done => {
    let skuData = skus[SKU];
    let transaction = {
      currency: 'usd',
      amount: skuData.amountInCents,
      source: TOKEN,
      description: 'Slide Therapy: ' + skuData.title,
      metadata: {
        oid: OID,
        sku: skuData.sku,
        email: EMAIL
      }
    };
    charge.processTransaction(transaction).then(chargeData => {
      done();
    }).catch(done);
  });
});
