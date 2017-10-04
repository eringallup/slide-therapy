const { Model } = require('./model');

class Order extends Model {
  constructor(data) {
    super();
    data = data || {};
    this.oid = data.oid;
    this.status = data.status || 'processing';
    this.sku = data.sku;
    this.email = data.email;
    this.token = data.token;
  }
}

module.exports = {
  Order: Order
};