const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
  let query = {
    TableName: 'counters',
    Key: {
      type: 'oid'
    }
  };
  dynamo.get(query, err => {
    if (err) {
      return callback(err);
    }
    let update = {
        TableName: 'counters',
        Key: {
          type: 'oid'
        },
      UpdateExpression: 'set currentCount = currentCount + :val',
      ExpressionAttributeValues: {
        ':val': 1
      },
      ReturnValues: 'UPDATED_NEW'
    };
    // console.log('update:', update);
    dynamo.update(update, (updateError, data) => {
      if (updateError) {
        return callback(updateError);
      }
      let currentCount = data && data.Attributes && data.Attributes.currentCount;
      if (!isNaN(currentCount)) {
        currentCount = parseInt(currentCount, 10);
      }
      callback(null, currentCount);
    });
  });
};