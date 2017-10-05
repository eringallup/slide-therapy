const config = require('../../config');

module.exports = OrderService;

class Model {
  constructor(data) {
    data = data || {};
    this.created = data.created || new Date();
    this.modified = data.modified || new Date();
    return this;
  }
}

class Order extends Model {
  constructor(data) {
    super(data);
    data = data || {};
    this.oid = data.oid;
    this.status = data.status || 'processing';
    this.sku = data.sku;
    this.email = data.email;
    this.token = data.token;
    this.downloads = data.downloads || 0;
  }
}

function OrderService(db) {
  this.db = db;
  this.getOid = getOid;
  this.getOrder = getOrder;
  this.saveOrder = saveOrder;
  this.completeOrder = completeOrder;
  this.getDownload = getDownload;
}

function getOid() {
  let collection = this.db.collection('counters');
  return collection.findOneAndUpdate({
    type: 'oid'
  }, {
    $inc: {
      count: 1
    }
  }, {
    returnOriginal: false
  }).then(doc => {
    return doc.value.count;
  });
}

function getOrder(oid) {
  let collection = this.db.collection('orders');
  return collection.findOne({
    oid: oid
  }).then(doc => {
    return new Order(doc);
  });
}

function getDownload(oid) {
  let collection = this.db.collection('orders');
  return collection.findOneAndUpdate({
    oid: oid
  }, {
    $inc: {
      downloads: 1
    }
  }, {
    returnOriginal: false
  }).then(doc => {
    return new Order(doc.value);
  });
}

function saveOrder(token, oid, sku, email) {
  // console.info('saveOrder', token, oid, sku, email);
  let collection = this.db.collection('orders');
  let order = new Order({
    oid: oid,
    email: email,
    sku: sku,
    token: token
  });
  // console.log(order);
  return collection.insertOne(order).then(result => {
    return this.getOrder(oid);
  });
}

function completeOrder(oid, charge) {
  // console.info('completeOrder', oid, charge);
  let collection = this.db.collection('orders');
  return collection.findOneAndUpdate({
    oid: oid
  }, {
    $set: {
      status: 'complete',
      charge: charge,
      modified: new Date()
    }
  }, {
    returnOriginal: false
  }).then(doc => {
    return new Order(doc.value);
  });
}