const Order = require('./order');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = (event, context, callback) => {
  let eventJson = JSON.parse(event.Records[0].Sns.Message);
  const orderDoc = new Order({
    oid: eventJson.oid,
    email: eventJson.email,
    sku: eventJson.sku,
    token: eventJson.token
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
        'oid': eventJson.oid
      }
    };
    dynamo.get(get, (getError, data) => {
      if (getError) {
        return callback(getError);
      }

      const message = {
        oid: eventJson.oid,
        email: eventJson.email,
        sku: eventJson.sku,
        token: eventJson.token
      };

      sns.publish({
        Message: JSON.stringify(message),
        TopicArn: process.env.snsArn
      }, snsError => {
        if (snsError) {
          return callback(snsError);
        }
        callback(null, {
          statusCode: 200,
          body: data.Item
        });
      });
    });
  });
};
