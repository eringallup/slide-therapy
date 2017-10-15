const Order = require('./order');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  let orderDoc = new Order({
    oid: event.oid,
    email: event.email,
    sku: event.sku,
    token: event.token
  });
  let update = {
    TableName: 'orders',
    Item: orderDoc
  };
  dynamo.put(update, (err, data) => {
    if (err) {
      return callback(err);
    }
    callback(null, data);
  });
};