const AWS = require('aws-sdk');
var lambda = new AWS.Lambda({
  region: 'us-west-2'
});
const skus = require('./skus.json');
const stripe = require('stripe')('sk_test_nkbxIavxItEv0Z8snt04O7h1');

exports.handler = (event, context, callback) => {
  // console.info('chargeStripe', event);
  _lambda('getOid', (oidError, oid) => {
    if (oidError) {
      return callback(oidError);
    }
    const skuData = skus[event.sku];
    const charge = {
      currency: 'usd',
      amount: skuData.amountInCents,
      source: event.token,
      description: 'Slide Therapy: ' + skuData.title,
      metadata: {
        oid: oid,
        sku: skuData.sku,
        email: event.email
      }
    };
    _lambda('saveOrder', {
      oid: oid,
      email: event.email,
      sku: event.sku,
      token: event.token
    }, (saveError, order) => {
      if (saveError) {
        return callback(saveError);
      }
      stripe.charges.create(charge, (stripeError, chargeData) => {
        if (stripeError) {
          return callback(stripeError);
        }
        _lambda.invoke('completeOrder', {
          oid: oid,
          charge: chargeData
        }, (completeOrderError, completedOrder) => {
          if (completeOrderError) {
            return callback(completeOrderError);
          }
          callback(null, completedOrder);
        });
      });
    });
  });
};

function _lambda(fn, payload, callback) {
  let lambdaConfig = {
    FunctionName: fn
  };
  if (payload) {
    lambdaConfig.Payload = JSON.stringify(payload, null, 2);
  }
  lambda.invoke(lambdaConfig, callback);
}
