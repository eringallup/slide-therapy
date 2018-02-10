const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const crypto = require('crypto');
const fs = require('fs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

exports.handler = (event, context, callback) => {
  // console.log('event:', event);
  // return callback(null, {
  //   isBase64Encoded: false,
  //   statusCode: 200,
  //   body: JSON.stringify(event)
  // });
  decrypt(event.t).then(jsonToken => {
    // console.log('jsonToken', jsonToken);
    const update = {
      TableName: 'orders',
      Key: {
        oid: parseInt(jsonToken.oid, 10)
      },
      UpdateExpression: 'set downloads = downloads + :val',
      ExpressionAttributeValues: {
        ':val': 1
      },
      ReturnValues: 'ALL_NEW'
    };
    // console.log('update:', update);
    dynamo.update(update, (err, order) => {
      if (err) {
        return callback(err);
      }
      if (jsonToken.token !== order.Attributes.token) {
        return callback(new Error('tokens do not match. ' + jsonToken.token + ' != ' + order.Attributes.token));
      }
      const downloadUrl = getSignedUrl(order.Attributes.sku);
      callback(null, {
        statusCode: 200,
        body: downloadUrl
      });
    });
  }).catch(callback);
};

function decrypt(token, password) {
  console.log('decrypt', token, password);
  return new Promise((resolve, reject) => {
    jwt.verify(token, (password || process.env.jwtSecret), (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

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

  let publicKey = fs.readFileSync(`./rsa-${process.env.access_key}.pem`);
  let privateKey = fs.readFileSync(`./pk-${process.env.access_key}.pem`);

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
