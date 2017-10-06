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
  return this.db.getOid();
}

function getOrder(oid) {
  return this.db.getOrder(oid).then(orderDoc => {
    return new Order(orderDoc);
  });
}

function saveOrder(token, oid, sku, email) {
  let order = new Order({
    oid: oid,
    email: email,
    sku: sku,
    token: token
  });
  return this.db.saveOrder(order).then(() => {
    return this.getOrder(oid);
  });
}

function completeOrder(oid, charge) {
  return this.db.completeOrder(oid, charge).then(() => {
    return this.getOrder(oid);
  });
}

function getDownload(oid) {
  return this.db.getDownload(oid).then(orderDoc => {
    return new Order(orderDoc);
  });
}