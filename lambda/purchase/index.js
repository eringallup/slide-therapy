const skus = require('./skus.json')
// const AWS = require('aws-sdk')
// const sns = new AWS.SNS()

exports.handler = (event, context, callback) => {
  let payload = {
    email: event.email,
    sku: event.sku,
    token: event.token,
    env: event.env
  }

  const skuData = skus[payload.sku]

  let stripeKey = process.env.stripe_key_prod
  if (payload.env === 'dev') {
    stripeKey = process.env.stripe_key_test
  }
  // console.log(payload.env, stripeKey)
  const stripe = require('stripe')(stripeKey)

  stripe.orders.create({
    currency: 'usd',
    email: payload.email,
    items: [{
      type: 'sku',
      currency: 'usd',
      description: skuData.description,
      amount: skuData.amountInCents,
      parent: payload.sku,
      quantity: 1
    }],
    metadata: {
      downloads: 0,
      slug: skuData.slug,
      env: payload.env
    }
  }, (createError, stripeOrder) => {
    if (createError) {
      return callback(createError)
    }
    console.log('stripeOrder', stripeOrder)
    stripe.orders.pay(stripeOrder.id, {
      source: payload.token
    }, (payError, paidOrder) => {
      if (payError) {
        return callback(payError)
      }
      callback(null, paidOrder)
    })
  })
}
