const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient()

exports.handler = (event, context, callback) => {
  let payload = {
    oid: event.oid,
    email: event.email,
    token: event.token,
    env: event.env
  }
  if (event.Records) {
    try {
      let snsData = JSON.parse(event.Records[0].Sns.Message)
      if (snsData) {
        payload = snsData
      }
    } catch (e) {
      console.error('Error parsing JSON', e)
    }
  }

  if (!payload.oid) {
    return callback(new Error('bad request 1'))
  }

  if (!payload.email && !payload.token) {
    return callback(new Error('bad request 2'))
  }

  const query = {
    TableName: 'orders',
    KeyConditionExpression: 'oid = :oid',
    ExpressionAttributeValues: {
      ':oid': parseInt(payload.oid, 10)
    },
    ExpressionAttributeNames: {
      '#TK': 'token'
    },
    ProjectionExpression: 'oid, email, created, modified, downloads, order_status, sku, #TK'
  }
  // console.log('query', query)
  dynamo.query(query, (scanError, data) => {
    if (scanError) {
      return callback(scanError)
    }
    let order = data && data.Items && data.Items[0]
    if (!order) {
      return callback(new Error('order not found 1'))
    }
    if (payload.email && order.email !== payload.email) {
      return callback(new Error('order not found 2'))
    }
    if (payload.token && order.token !== `tok_${payload.token}`) {
      return callback(new Error('order not found 3'))
    }
    callback(null, order)
  })
}
