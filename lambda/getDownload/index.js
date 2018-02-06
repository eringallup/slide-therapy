const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');
const skus = require('./skus.json');

exports.handler = (event, context, callback) => {
  const update = {
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
    const downloadUrl = getSignedUrl(order.sku);
    callback(null, downloadUrl);
  });
};

function getSignedUrl(deck) {
  // console.log('getSignedUrl', deck);
  let baseUrl = 'https://' + process.env.download + '/test.txt';
  let now = new Date();
  let expiresUtc = Math.round(new Date(now.valueOf() + (1000 * 15)) / 1000);
  let expires = '?Expires=' + expiresUtc;

  let policyStatementJson = JSON.stringify({
     Statement: [{
       Resource: baseUrl,
       Condition: {
          DateLessThan: {
            'AWS:EpochTime': expiresUtc
          }
       }
    }]
  });
  // console.log(policyStatementJson);

  let sign = crypto.createSign('RSA-SHA1');
  let verify = crypto.createVerify('RSA-SHA1');

  let privateKey = fs.readFileSync(process.env.private_key);
  let publicKey = fs.readFileSync(process.env.public_key);

  sign.update(policyStatementJson, 'utf8');
  verify.update(policyStatementJson, 'utf8');

  let signed = sign.sign(privateKey).toString('base64');
  let verified = verify.verify(publicKey, signed, 'base64');
  // console.log('verified', verified);

  signed = signed.replace(/\+/g, '-');
  signed = signed.replace(/\=/g, '_');
  signed = signed.replace(/\//g, '~');
  let signature = '&Signature=' + signed;

  let keyPair = '&Key-Pair-Id=' + process.env.access_key;

  let url = baseUrl + expires + signature + keyPair
  // console.log(baseUrl, '\n');
  // console.log(url, '\n');
  return url;
}
