const _ = require('lodash')
const crypto = require('crypto')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const skus = require('./skus.json')

exports.handler = (event, context, callback) => {
  let stripeKey = process.env.stripe_key_prod
  if (event.env === 'dev') {
    stripeKey = process.env.stripe_key_test
  }
  // console.log(payload.env, stripeKey)
  const stripe = require('stripe')(stripeKey)

  if (event.o) {
    downloadOwned(stripe, event.o, event.email).then(data => {
      callback(null, {
        statusCode: 200,
        body: data
      })
    }).catch(callback)
  } else if (event.t) {
    downloadWithToken(stripe, event.t).then(data => {
      callback(null, {
        statusCode: 200,
        body: data
      })
    }).catch(callback)
  } else {
    callback(new Error('invalid data'))
  }
}

function downloadOwned (stripe, oid, email) {
  return getOrder(stripe, oid).then(orderItem => {
    return geDownloadUrls(orderItem.parent)
  })
}

function downloadWithToken (stripe, token) {
  return decrypt(token).then(jsonToken => {
    // console.log('jsonToken', jsonToken);
    return getOrder(stripe, jsonToken.oid).then(orderItem => {
      return geDownloadUrls(orderItem.parent)
    })
  })
}

function geDownloadUrls (sku) {
  const skuData = skus[sku]
  let downloadUrls = {}
  skuData.purchase_rights.forEach(purchaseRight => {
    downloadUrls[purchaseRight] = getSignedUrl(purchaseRight)
  })
  return downloadUrls
}

function getOrder (stripe, oid) {
  return stripe.orders.retrieve(oid).then(stripeOrder => {
    const orderItem = _.find(stripeOrder.items, {
      object: 'order_item'
    })
    if (!orderItem) {
      return new Error('orderItem not found')
    }
    let downloads = parseInt(stripeOrder.metadata.downloads, 10)
    // console.log('downloads', downloads, isNaN(downloads))
    if (isNaN(downloads)) {
      downloads = 0
    }
    return stripe.orders.update(oid, {
      metadata: {
        downloads: (downloads + 1)
      }
    }).then(() => {
      return orderItem
    })
  })
}

function decrypt (token, password) {
  // console.log('decrypt', token, password);
  return new Promise((resolve, reject) => {
    jwt.verify(token, (password || process.env.jwtSecret), (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function getSignedUrl (sku) {
  console.log('getSignedUrl', sku)
  let baseUrl = 'https://' + process.env.download + '/test.txt?sku=' + sku
  let now = new Date()
  let expiresUtc = Math.round(new Date(now.valueOf() + (1000 * 15)) / 1000)
  let expires = '&Expires=' + expiresUtc

  let policyStatementJson = JSON.stringify({
    Statement: [{
      Resource: baseUrl,
      Condition: {
        DateLessThan: {
          'AWS:EpochTime': expiresUtc
        }
      }
    }]
  })
  // console.log(policyStatementJson)

  let sign = crypto.createSign('RSA-SHA1')
  let verify = crypto.createVerify('RSA-SHA1')

  let publicKey = fs.readFileSync(`./rsa-${process.env.access_key}.pem`)
  let privateKey = fs.readFileSync(`./pk-${process.env.access_key}.pem`)

  sign.update(policyStatementJson, 'utf8')
  verify.update(policyStatementJson, 'utf8')

  let signed = sign.sign(privateKey).toString('base64')
  let verified = verify.verify(publicKey, signed, 'base64')
  console.log('verified', verified)

  signed = signed.replace(/\+/g, '-')
  signed = signed.replace(/=/g, '_')
  signed = signed.replace(/\//g, '~')
  let signature = '&Signature=' + signed

  let keyPair = '&Key-Pair-Id=' + process.env.access_key

  let url = baseUrl + expires + signature + keyPair
  // console.log(baseUrl, '\n')
  // console.log(url, '\n')
  return url
}
