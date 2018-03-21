const _ = require('lodash')
const AWS = require('aws-sdk')
const ses = new AWS.SES({
  region: 'us-west-2',
  apiVersion: '2010-12-01'
})
const jwt = require('jsonwebtoken')
const skus = require('skus.json')
const DateTime = require('luxon').DateTime

exports.handler = (event, context, callback) => {
  let payload = {
    oid: event.oid,
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

  let webUrl = process.env.webUrlProd
  let stripeKey = process.env.stripe_key_prod
  if (event.env === 'dev') {
    webUrl = process.env.webUrlDev
    stripeKey = process.env.stripe_key_test
  }
  // console.log(payload.env, stripeKey)
  const stripe = require('stripe')(stripeKey)

  stripe.orders.retrieve(payload.oid).then(stripeOrder => {
    return sendFile(stripeOrder, webUrl).then(() => callback())
  }).catch(callback)
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

function sendFile (stripeOrder, webUrl) {
  const orderItem = _.find(stripeOrder.items, {
    object: 'order_item'
  })
  if (!orderItem) {
    return new Error('orderItem not found')
  }
  return encrypt({
    oid: stripeOrder.id,
    charge: stripeOrder.charge,
    created: stripeOrder.created
  }).then(jwt => {
    let url = `${webUrl}/download?t=${jwt}&d=true`
    let createdDate = DateTime.fromMillis(stripeOrder.created * 1000)
    stripeOrder.createdDate = createdDate
      .setLocale('en-US')
      .setZone('America/Chicago')
      .toLocaleString(DateTime.DATETIME_FULL)
    return send(stripeOrder.email, {
      sku: skus[orderItem.parent],
      order: stripeOrder,
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
    // console.log(params)
    ses.sendTemplatedEmail(params, (err, data) => {
      if (err) {
        return reject(err, err.stack)
      }
      resolve(data)
    })
  })
}
