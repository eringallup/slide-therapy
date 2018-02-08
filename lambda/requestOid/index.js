const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = (event, context, callback) => {
  const query = {
    TableName: 'counters',
    Key: {
      type: 'oid'
    }
  };
  dynamo.get(query, err => {
    if (err) {
      return callback(err);
    }
    const update = {
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

      const message = {
        oid: currentCount,
        email: event.email,
        sku: event.sku,
        token: event.token
      };

      sns.publish({
        Message: JSON.stringify(message),
        TopicArn: process.env.snsArn
      }, (snsError, snsData) => {
        if (snsError) {
          return callback(snsError);
        }
        callback(null, {
          statusCode: 200,
          body: JSON.stringify(message)
        });
      });
    });
  });
};