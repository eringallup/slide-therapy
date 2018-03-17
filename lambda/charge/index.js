const _ = require('lodash')
const skus = require('./skus.json')
const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()
const stripe = require('stripe')(process.env.stripe_key)
const sns = new AWS.SNS()

exports.handler = (event, context, callback) => {
  let payload = {
    oid: event.oid,
    email: event.email,
    sku: event.sku,
    token: event.token
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
      email: payload.email
    }
  }
  stripe.charges.create(charge, (chargeError, chargeData) => {
    if (chargeError) {
      return callback(chargeError)
    }

    const query = {
      TableName: 'orders',
      Key: {
        oid: payload.oid
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
        return callback(updateError)
      }

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
  })
}
