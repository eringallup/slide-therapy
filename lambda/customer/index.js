const _ = require('lodash')
// const AWS = require('aws-sdk')
// const sns = new AWS.SNS()

exports.handler = (event, context, callback) => {
  let payload = {
    email: event.email,
    first_name: event.first_name,
    last_name: event.last_name,
    env: event.env
  }

  let stripeKey = process.env.stripe_key_prod
  if (payload.env === 'dev') {
    stripeKey = process.env.stripe_key_test
  }
  // console.log(payload.env, stripeKey)
  const stripe = require('stripe')(stripeKey)

  stripe.customers.list({
    email: payload.email,
    limit: 3
  }, (listError, customers) => {
    if (listError) {
      return callback(listError)
    }

    const existingCustomer = _.find(customers.data, {
      email: payload.email
    })
    if (existingCustomer) {
      return callback(null, {
        statusCode: 208,
        body: {
          customer: existingCustomer.id,
          env: payload.env
        }
      })
    }

    stripe.customers.create({
      email: payload.email,
      metadata: {
        first_name: payload.first_name,
        last_name: payload.last_name
      }
    }, (createError, customer) => {
      callback(null, {
        statusCode: 200,
        body: {
          customer: customer.id,
          env: payload.env
        }
      })
    })
  })
}
