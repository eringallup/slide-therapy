const config = require('../config');
const stripe = require('stripe')(config.stripe.secret_key);
const crypto = require('crypto');

module.exports = chargeStripe;

function chargeStripe(db, token, sku, email) {
  // console.info('chargeStripe', token, sku, email);
  return db.getOid().then((oid) => {
    let skuData = config.skus[sku];
    let charge = {
      currency: 'usd',
      amount: skuData.amountInCents,
      source: token,
      description: 'Slide Therapy',
      metadata: {
        oid: oid,
        sku: skuData.id,
        email: email
      }
    };
    return db.saveOrder(token, oid, skuData, email).then(order => {
      return stripe.charges.create(charge).then(chargeData => {
        return db.completeOrder(oid, chargeData);
      });
    });
  });
}
