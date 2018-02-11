const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  if (!event.email) {
    return callback(new Error('unknown user'));
  }
  const query = {
    TableName: 'orders',
    FilterExpression : 'email = :email',
    ExpressionAttributeValues : {
      ':email' : event.email
    }
  };
  // console.log(query);
  dynamo.scan(query, (err, data) => {
    callback(err, {
      statusCode: 200,
      body: data
    });
  });
};