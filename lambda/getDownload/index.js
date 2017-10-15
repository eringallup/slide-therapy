const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  let update = {
    TableName: 'orders',
    Key: {
      oid: parseInt(event.oid, 10)
    },
    UpdateExpression: 'set downloads = downloads + :val',
    ExpressionAttributeValues: {
      ':val': 1
    },
    ReturnValues: 'UPDATED_NEW'
  };
  // console.log('update:', update);
  dynamo.update(update, (err, order) => {
    if (err) {
      return callback(err);
    }
    callback(null, order && order.Item);
  });
};