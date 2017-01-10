'use strict';

const config = require('../config/config.json');
const moment = require('moment');
const crypto = require('crypto');
const fs = require('fs');

module.exports = download;

function download(token, email) {
  return new Promise((resolve, reject) => {
    let baseUrl = 'https://' + config.cdn.download + '/test.txt';
    let expiresUtc = moment().add(1, 'minute').unix();
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
    resolve(url);
  });
}
