const skus = require('./skus.json')
const _ = require('lodash')
const AWS = require('aws-sdk')

exports.handler = (event, context, callback) => {
  const payload = {
    email: event.email,
    firstName: event.firstName,
    lastName: event.lastName,
    sku: event.sku,
    token: event.token,
    env: event.env
  }

  const stripeKeyType = payload.env === 'dev' ? 'stripe_key_test' : 'stripe_key_prod'
  const stripeKey = process.env[stripeKeyType]
  // console.log(payload.env, stripeKeyType, stripeKey)
  const stripe = require('stripe')(stripeKey)

  makePurchase(stripe, payload).then(body => {
    callback(null, {
      statusCode: 200,
      body: body
    })
  }).catch(error => {
    callback(error)
  })
}

async function makePurchase (stripe, payload) {
  try {
    const customer = await getOrCreateCustomer(stripe, payload)
    // console.log('customer', customer)
    const stripeOrder = await createOrder(stripe, customer, payload)
    // console.log('stripeOrder', stripeOrder)
    const paidOrder = await payOrder(stripe, stripeOrder, customer, payload)
    // console.log('paidOrder', paidOrder)
    const snsBody = await snsPublish(paidOrder, customer, payload)
    console.log('snsBody', snsBody)
    return snsBody
  } catch (e) {
    return e
  }
}

async function snsPublish (paidOrder, customer, payload) {
  const data = {
    oid: paidOrder.id,
    customer: customer.id,
    env: payload.env
  }
  const sns = new AWS.SNS()
  const publish = sns.publish({
    Message: JSON.stringify(data),
    TopicArn: process.env.snsArn
  }).promise()

  return publish.then(() => {
    return data
  })
}

async function payOrder (stripe, stripeOrder, customer, payload) {
  return stripe.orders.pay(stripeOrder.id, {
    customer: customer.id
  })
}

async function createOrder (stripe, customer, payload) {
  const skuData = skus[payload.sku]
  return stripe.orders.create({
    currency: 'usd',
    customer: customer.id,
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
  })
}

async function getOrCreateCustomer (stripe, payload) {
  return stripe.customers.list({
    email: payload.email,
    limit: 3
  }).then(customers => {
    const existingCustomer = _.find(customers.data, {
      email: payload.email
    })
    if (existingCustomer) {
      return stripe.customers.update(existingCustomer.id, {
        source: payload.token
      })
    }

    return stripe.customers.create({
      email: payload.email,
      source: payload.token,
      metadata: {
        first_name: payload.firstName,
        last_name: payload.lastName
      }
    })
  })
}
