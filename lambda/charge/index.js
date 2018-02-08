const _ = require('lodash');
const skus = require('./skus.json');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const stripe = require('stripe')(process.env.stripe_key);

exports.handler = (event, context, callback) => {
  let eventJson = JSON.parse(event.Records[0].Sns.Message);
  const skuData = skus[eventJson.sku];
  const charge = {
    currency: 'usd',
    amount: skuData.amountInCents,
    source: eventJson.token,
    description: 'Slide Therapy: ' + skuData.title,
    metadata: {
      oid: eventJson.oid,
      sku: skuData.sku,
      email: eventJson.email
    }
  };
  stripe.charges.create(charge, (chargeError, chargeData) => {
    if (chargeError) {
      return callback(chargeError);
    }

    const query = {
      TableName: 'orders',
      Key: {
        oid: eventJson.oid
      },
      UpdateExpression: 'set order_status = :status, charge = :charge, modified = :modified',
      ExpressionAttributeValues: {
        ':status': 'complete',
        ':charge': chargeData,
        ':modified': new Date().toString()
      },
      ReturnValues: 'UPDATED_NEW'
    };
    dynamo.update(query, (updateError, data) => {
      if (updateError) {
        return callback(updateError);
      }
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(_.omit(data.Attributes, 'charge'))
      });
    });
  });
};
