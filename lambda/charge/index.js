const _ = require('lodash')
const skus = require('./skus.json')
const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const sns = new AWS.SNS()

exports.handler = (event, context, callback) => {
  let payload = {
    oid: event.oid,
    email: event.email,
    sku: event.sku,
    token: event.token,
    env: event.env
  }
  try {
    let snsData = JSON.parse(event.Records[0].Sns.Message)
    if (snsData) {
      payload = snsData
    }
  } catch (e) {
    console.error('Error parsing JSON', e)
  }

  const skuData = skus[payload.sku]
  const charge = {
    currency: 'usd',
    amount: skuData.amountInCents,
    source: payload.token,
    description: 'Slide Therapy: ' + skuData.title,
    metadata: {
      oid: payload.oid,
      sku: skuData.sku,
      email: payload.email,
      env: payload.env
    }
  }
  let stripeKey = payload.env === 'dev' ? process.env.stripe_key_test : process.env.stripe_key_prod
  // console.log(payload.env, stripeKey)
  const stripe = require('stripe')(stripeKey)
  stripe.charges.create(charge, (chargeError, chargeData) => {
    if (chargeError) {
      markOrderFailed(payload.oid, chargeData)
        .then(() => callback(chargeError))
        .catch(callback)
    } else {
      markOrderComplete(payload.oid, chargeData)
        .then(data => {
          sns.publish({
            Message: JSON.stringify(payload),
            TopicArn: process.env.snsArn
          }, snsError => {
            if (snsError) {
              return callback(snsError)
            }
            callback(null, {
              statusCode: 200,
              body: _.omit(data.Attributes, 'charge')
            })
          })
        })
        .catch(callback)
    }
  })
}

function markOrderComplete (oid, chargeData) {
  return new Promise((resolve, reject) => {
    const query = {
      TableName: 'orders',
      Key: {
        oid: oid
      },
      UpdateExpression: 'set order_status = :status, charge = :charge, modified = :modified',
      ExpressionAttributeValues: {
        ':status': 'complete',
        ':charge': chargeData,
        ':modified': new Date().toString()
      },
      ReturnValues: 'UPDATED_NEW'
    }
    dynamo.update(query, (updateError, data) => {
      if (updateError) {
        return reject(updateError)
      }
      resolve(data)
    })
  })
}

function markOrderFailed (oid, chargeData) {
  return new Promise((resolve, reject) => {
    const query = {
      TableName: 'orders',
      Key: {
        oid: oid
      },
      UpdateExpression: 'set order_status = :status, charge = :charge, modified = :modified',
      ExpressionAttributeValues: {
        ':status': 'failed',
        ':charge': chargeData,
        ':modified': new Date().toString()
      },
      ReturnValues: 'UPDATED_NEW'
    }
    dynamo.update(query, (updateError, data) => {
      if (updateError) {
        return reject(updateError)
      }
      resolve(data)
    })
  })
}
