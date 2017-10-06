const config = require('../config');
const skus = require('../skus.json');
const stripe = require('stripe')(config.stripe.secret_key);

module.exports = chargeStripe;
module.exports.processTransaction = processTransaction;

function chargeStripe(orderService, token, sku, email) {
  // console.info('chargeStripe', token, sku, email);
  return orderService.getOid().then(oid => {
    let skuData = skus[sku];
    let charge = {
      currency: 'usd',
      amount: skuData.amountInCents,
      source: token,
      description: 'Slide Therapy: ' + skuData.title,
      metadata: {
        oid: oid,
        sku: skuData.sku,
        email: email
      }
    };
    return orderService.saveOrder(token, oid, skuData, email).then(order => {
      return processTransaction(charge).then(chargeData => {
        return orderService.completeOrder(oid, chargeData);
      });
    });
  });
}

function processTransaction(charge) {
  return stripe.charges.create(charge);
}
