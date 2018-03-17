const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const crypto = require('crypto')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const skus = require('./skus.json')

exports.handler = (event, context, callback) => {
  if (event.o) {
    downloadOwned(parseInt(event.o, 10), event.email).then(data => {
      callback(null, {
        statusCode: 200,
        body: data
      })
    }).catch(callback)
  } else if (event.t) {
    downloadWithToken(event.t).then(data => {
      callback(null, {
        statusCode: 200,
        body: data
      })
    }).catch(callback)
  } else {
    callback(new Error('invalid data'))
  }
}

function downloadOwned (oid, email) {
  return new Promise((resolve, reject) => {
    getOrder(oid, email, order => {
      return order.order_status === 'complete'
    }).then(() => {
      const update = {
        TableName: 'orders',
        Key: {
          oid: oid
        },
        UpdateExpression: 'set downloads = downloads + :val',
        ExpressionAttributeValues: {
          ':val': 1
        },
        ReturnValues: 'ALL_NEW'
      }
      // console.log('update:', update)
      dynamo.update(update, (err, order) => {
        if (err) {
          return reject(err)
        }
        const downloadUrl = getSignedUrl(order.Attributes.sku)
        resolve({
          deck: skus[order.Attributes.sku],
          downloadUrl: downloadUrl
        })
      })
    }).catch(reject)
  })
}

function downloadWithToken (token) {
  return new Promise((resolve, reject) => {
    decrypt(token).then(jsonToken => {
      // console.log('jsonToken', jsonToken);
      const oid = parseInt(jsonToken.oid, 10)
      getOrder(oid, null, order => {
        return order.order_status === 'complete' && jsonToken.token === order.token
      }).then(() => {
        const update = {
          TableName: 'orders',
          Key: {
            oid: oid
          },
          UpdateExpression: 'set downloads = downloads + :val',
          ExpressionAttributeValues: {
            ':val': 1
          },
          ReturnValues: 'ALL_NEW'
        }
        // console.log('update:', update)
        dynamo.update(update, (err, order) => {
          if (err) {
            return reject(err)
          }
          const downloadUrl = getSignedUrl(order.Attributes.sku)
          resolve({
            deck: skus[order.Attributes.sku],
            downloadUrl: downloadUrl
          })
        })
      }).catch(reject)
    }).catch(reject)
  })
}

function getOrder (oid, email, validatorFn) {
  return new Promise((resolve, reject) => {
    let attrs = {}
    let filter = []
    if (oid) {
      attrs[':oid'] = oid
      filter.push('oid = :oid')
    }
    if (email) {
      attrs[':email'] = email
      filter.push('email = :email')
    }
    const query = {
      TableName: 'orders',
      FilterExpression: filter.join(' and '),
      ExpressionAttributeValues: attrs
    }
    dynamo.scan(query, (scanError, data) => {
      if (scanError) {
        return reject(scanError)
      }
      let order = data && data.Items && data.Items[0]
      if (!order) {
        return reject(new Error('order not found'))
      }
      if (typeof validatorFn === 'function') {
        const isValid = validatorFn(order)
        if (!isValid) {
          return reject(new Error('order not valid'))
        }
      }
      resolve(order)
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

function getSignedUrl (deck) {
  console.log('getSignedUrl', deck)
  let baseUrl = 'https://' + process.env.download + '/test.txt'
  let now = new Date()
  let expiresUtc = Math.round(new Date(now.valueOf() + (1000 * 15)) / 1000)
  let expires = '?Expires=' + expiresUtc

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
