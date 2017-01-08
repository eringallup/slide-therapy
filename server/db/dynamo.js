'use strict';

const _ = require('underscore');
const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2',
  endpoint: 'https://dynamodb.us-west-2.amazonaws.com'
});
const db = new AWS.DynamoDB.DocumentClient();

module.exports = {
  getOid: getOid,
  saveOrder: saveOrder
};

function saveOrder(token, oid, sku, uid, email) {
  console.info('-- saveOrder --');
  return new Promise((resolve, reject) => {
    let date = new Date();
    let update = {
      TableName: 'orders',
      Item: {
        uid: uid,
        oid: oid,
        sku: sku.id,
        amount: sku.amountInCents,
        created: Math.round(date / 1000),
        created_at: date.toUTCString(),
        email: email,
        token: token
      }
    };
    db.put(update, function(err, json) {
      if (err) {
        return reject(err);
      }
      console.log('---', json);
      resolve(json);
    });
  });
}

function getOid() {
  console.info('-- getOid --');
  return new Promise((resolve, reject) => {
    let query = {
      TableName: 'counters',
      Key: {
        id: 'oid'
      }
    };
    db.get(query, function(err, json) {
      if (err) {
        return reject(err);
      }
      let update = _.extend({
        UpdateExpression: 'set currentCount = currentCount + :val',
        ExpressionAttributeValues: {
          ':val': 1
        },
        ReturnValues: 'UPDATED_NEW'
      }, query);
      // console.log('update:', update);
      db.update(update, function(updateError, json) {
        if (updateError) {
          return reject(updateError);
        }
        resolve(json && json.Attributes.currentCount);
      });
    });
  });
}