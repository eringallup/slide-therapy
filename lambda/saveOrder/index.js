const Order = require('./order')
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
  const orderDoc = new Order(payload)
  let update = {
    TableName: 'orders',
    Item: orderDoc
  }
  dynamo.put(update, putError => {
    if (putError) {
      return callback(putError)
    }
    const get = {
      TableName: 'orders',
      Key: {
        'oid': payload.oid
      }
    }
    dynamo.get(get, (getError, data) => {
      if (getError) {
        return callback(getError)
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
          body: data.Item
        })
      })
    })
  })
}
