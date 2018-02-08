const _ = require('lodash');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  const query = {
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
  dynamo.update(query, (updateError, data) => {
    if (updateError) {
      return callback(updateError);
    }
    callback(null, _.omit(data.Attributes, 'charge'));
  });
};