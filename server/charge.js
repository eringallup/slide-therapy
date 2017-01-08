'use strict';

const config = require('../config/config.json');
const stripe = require('stripe')(config.stripe.secret_key);
const crypto = require('crypto');
const db = require('./db');

module.exports = chargeStripe;

function chargeStripe(token, sku, uid, email) {
  return new Promise((resolve, reject) => {
    db.getOid().then(function(oid) {
      let skuData = config.skus[sku];
      let hash = crypto.createHash('md5').update(oid + email + token).digest('hex')
      let charge = {
        currency: 'usd',
        amount: skuData.amountInCents,
        source: token,
        description: 'Slide Therapy',
        metadata: {
          oid: oid,
          sku: skuData.id,
          uid: uid,
          email: email
        }
      };
      // TODO: save to db as processing, then call stripe, then set to processed.
      stripe.charges.create(charge, function(err, charge) {
        if (err) {
          return reject(err);
        }
        db.saveOrder(token, oid, skuData, uid, email).then(resolve, function(dbError) {
          console.error('dbError', dbError);
          resolve();
        });
      });
    }, reject);
  });
}
