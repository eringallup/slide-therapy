const Order = require('./order');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const orderDoc = new Order({
    oid: event.oid,
    email: event.email,
    sku: event.sku,
    token: event.token
  });
  let update = {
    TableName: 'orders',
    Item: orderDoc
  };
  dynamo.put(update, putError => {
    if (putError) {
      return callback(putError);
    }
    const get = {
      TableName: 'orders',
      Key: {
        'oid': event.oid
      }
    };
    dynamo.get(get, (getError, data) => {
      if (getError) {
        return callback(getError);
      }
      callback(null, data.Item);
    });
  });
};