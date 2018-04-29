const _ = require('lodash')

exports.handler = (event, context, callback) => {
  let payload = {
    email: event.email,
    first_name: event.first_name,
    last_name: event.last_name,
    industry: event.industry,
    env: event.env
  }

  const stripeKeyType = payload.env === 'dev' ? 'stripe_key_test' : 'stripe_key_prod'
  const stripeKey = process.env[stripeKeyType]
  // console.log(payload.env, stripeKeyType, stripeKey)
  const stripe = require('stripe')(stripeKey)

  customer(stripe, payload).then(customer => {
    callback(null, {
      statusCode: 200,
      body: {
        customer: customer.id,
        env: payload.env
      }
    })
  }).catch(error => {
    callback(error)
  })
}

async function customer (stripe, payload) {
  try {
    const existingCustomer = await getCustomerByEmail(stripe, payload)
    if (existingCustomer) {
      return stripe.customers.update(existingCustomer.id, {
        metadata: {
          first_name: payload.first_name,
          last_name: payload.last_name,
          industry: payload.industry
        }
      })
    }
    return await createCustomer(stripe, payload)
  } catch (e) {
    return e
  }
}

async function getCustomerByEmail (stripe, payload) {
  return stripe.customers.list({
    email: payload.email,
    limit: 3
  }).then(customers => {
    const existingCustomer = _.find(customers.data, {
      email: payload.email
    })
    return existingCustomer
  })
}

async function createCustomer (stripe, payload) {
  return stripe.customers.create({
    email: payload.email,
    metadata: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      industry: payload.industry
    }
  })
}
