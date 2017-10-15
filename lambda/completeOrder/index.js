const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  let query = {
    TableName: 'orders',
    Key: {
      oid: event.oid
    },
    UpdateExpression: 'set order_status = :status, charge = :charge, modified = :modified',
    ExpressionAttributeValues: {
      ':status': 'complete',
      ':charge': event.charge,
      ':modified': new Date().toString()
    },
    ReturnValues: 'UPDATED_NEW'
  };
  dynamo.update(query, (err, data) => {
    if (err) {
      return callback(err);
    }
    callback(null, data);
  });
};