const AWS = require('aws-sdk')
const ses = new AWS.SES({
  region: 'us-west-2',
  apiVersion: '2010-12-01'
})
const dynamo = new AWS.DynamoDB.DocumentClient()
const jwt = require('jsonwebtoken')
const skus = require('skus.json')

exports.handler = (event, context, callback) => {
  let payload = {
    oid: event.oid
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
    sendFile(data.Item).then(() => {
      callback()
    }).catch(callback)
  })
}

function encrypt (json, password, expiresIn) {
  // console.log('encrypt', json, password, expiresIn);
  return new Promise((resolve, reject) => {
    let tokenConfig = {}
    if (expiresIn) {
      tokenConfig.expiresIn = expiresIn
    }
    jwt.sign(json, (password || process.env.jwtSecret), tokenConfig, (err, token) => {
      if (err) {
        return reject(err)
      }
      resolve(token)
    })
  })
}

function sendFile (order) {
  // console.log('sendFile', _.omit(order, 'charge'));
  return encrypt({
    oid: order.oid,
    token: order.token,
    created: order.created.valueOf()
  }).then(jwt => {
    let url = `${process.env.webUrl}/download?t=${jwt}&d=true`
    return send(order.email, {
      sku: skus[order.sku],
      url: url
    })
  })
}

function send (to, context) {
  return new Promise((resolve, reject) => {
    if (!to || !context) {
      return reject(new Error('missing to or context field'))
    }

    let params = {
      Destination: {
        ToAddresses: [ to ]
      },
      Template: process.env.emailTemplate,
      TemplateData: JSON.stringify(context),
      Source: process.env.supportEmailAddress,
      SourceArn: process.env.emailArn,
      ConfigurationSetName: process.env.emailConfigurationSetName
    }
    console.log(params)
    ses.sendTemplatedEmail(params, (err, data) => {
      if (err) {
        return reject(err, err.stack)
      }
      resolve(data)
    })
  })
}
