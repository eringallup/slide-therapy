const config = require('../config');
const skus = require('../skus.json');
const crypto = require('crypto');
const fs = require('fs');

module.exports = download;
module.exports.getSignedUrl = getSignedUrl;

function download(orderService, oid, token, created) {
  // console.info('download', oid, token, created);
  return orderService.getDownload(oid).then(order => {
    let createdValue = new Date(order.created).valueOf();
    // console.log(order.token);
    // console.log(token);
    // console.log(createdValue);
    // console.log(created);
    if (order.token !== token || createdValue !== created) {
      throw new Error('bad request. token or date does not match.');
    }
    return getSignedUrl(skus[order.sku.sku]);
  });
}

function getSignedUrl(deck) {
  // console.log('getSignedUrl', deck);
  let baseUrl = 'https://' + config.cdn.download + '/test.txt';
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

  let privateKey = fs.readFileSync(config.cdn.private_key);
  let publicKey = fs.readFileSync(config.cdn.public_key);

  sign.update(policyStatementJson, 'utf8');
  verify.update(policyStatementJson, 'utf8');

  let signed = sign.sign(privateKey).toString('base64');
  let verified = verify.verify(publicKey, signed, 'base64');
  // console.log('verified', verified);

  signed = signed.replace(/\+/g, '-');
  signed = signed.replace(/\=/g, '_');
  signed = signed.replace(/\//g, '~');
  let signature = '&Signature=' + signed;

  let keyPair = '&Key-Pair-Id=' + config.cdn.access_key;

  let url = baseUrl + expires + signature + keyPair
  // console.log(baseUrl, '\n');
  // console.log(url, '\n');
  return url;
}
