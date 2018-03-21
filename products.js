const async = require('async')
const _ = require('lodash')
const skus = require('./skus.json')

let baseUrl = 'https://local.slidetherapy.com'
let stripeKey = 'rk_test_cNxP99L20nHB9EhWZp2j0SLe'
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://slidetherapy.com'
  stripeKey = 'rk_live_gUNJZHcIudglsoqsEq0hffiF'
  console.log('---------- LIVE ----------')
} else {
  console.log('---------- TEST ----------')
}

const stripe = require('stripe')(stripeKey)

async.parallel({
  skus: next => {
    stripe.skus.list({}, next)
  },
  products: next => {
    stripe.products.list({}, next)
  }
}, (errors, stripeData) => {
  if (errors) {
    return _exit(errors)
  }

  async.each(skus, (item, nextItem) => {
    const existingProduct = _.find(stripeData.products.data, stripeProduct => {
      return stripeProduct.metadata.slug === item.slug
    })
    // console.log(existingProduct, item.slug)
    if (existingProduct) {
      updateProduct(existingProduct, item)
        .then(_product => onProduct(_product, item, stripeData))
        .then(() => {
          nextItem()
        })
        .catch(nextItem)
    } else {
      createProduct(item)
        .then(_product => onProduct(_product, item, stripeData))
        .then(() => {
          nextItem()
        })
        .catch(nextItem)
    }
  }, _exit)
})

function onProduct (stripeProduct, item, stripeData) {
  const existingSku = _.find(stripeData.skus.data, stripeSku => {
    return parseInt(stripeSku.id, 10) === item.sku
  })
  // console.log(stripeProduct.skus.data, item.sku, existingSku)
  if (!existingSku) {
    return createSku(item, stripeProduct)
  } else {
    return updateSku(existingSku, item, stripeProduct)
  }
}

function createSku (item, stripeProduct) {
  const createData = {
    id: item.sku,
    currency: 'usd',
    inventory: {
      type: 'infinite'
    },
    price: item.amountInCents,
    product: stripeProduct.id
  }
  console.log('++ create sku', createData.id)
  return stripe.skus.create(createData)
}

function updateSku (existingSku, item, stripeProduct) {
  const updateData = {
    currency: 'usd',
    price: item.amountInCents,
    product: stripeProduct.id
  }
  console.log('~~ update sku', existingSku.id)
  return stripe.skus.update(existingSku.id, updateData)
}

function createProduct (item) {
  const createData = {
    name: item.title,
    description: item.description,
    type: 'good',
    url: `${baseUrl}/templates/${item.slug}`,
    shippable: false,
    metadata: {
      slug: item.slug
    }
  }
  console.log('++ create product', createData.name)
  return stripe.products.create(createData)
}

function updateProduct (existingProduct, item) {
  const updateData = {
    name: item.title,
    description: item.description,
    url: `${baseUrl}/templates/${item.slug}`,
    metadata: {
      slug: item.slug
    }
  }
  console.log('~~ update product', updateData.name)
  return stripe.products.update(existingProduct.id, updateData)
}

function _exit (errors) {
  if (errors) {
    console.error('errors:', errors)
  }
  process.exit(errors)
}
