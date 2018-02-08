const skus = require('./skus.json');
const stripe = require('stripe')(process.env.stripe_key);

exports.handler = (event, context, callback) => {
  const skuData = skus[event.sku];
  const charge = {
    currency: 'usd',
    amount: skuData.amountInCents,
    source: event.token,
    description: 'Slide Therapy: ' + skuData.title,
    metadata: {
      oid: event.oid,
      sku: skuData.sku,
      email: event.email
    }
  };
  stripe.charges.create(charge, callback);
};
