const config = require('../config');
const stripe = require('stripe')(config.stripe.secret_key);

module.exports = chargeStripe;

function chargeStripe(orderService, token, sku, email) {
  // console.info('chargeStripe', token, sku, email);
  return orderService.getOid().then(oid => {
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
    return orderService.saveOrder(token, oid, skuData, email).then(order => {
      return stripe.charges.create(charge).then(chargeData => {
        return orderService.completeOrder(oid, chargeData);
      });
    });
  });
}
