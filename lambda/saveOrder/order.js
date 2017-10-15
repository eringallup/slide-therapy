class Model {
  constructor(data) {
    data = data || {};
    this.created = (data.created || new Date()).toString();
    this.modified = (data.modified || new Date()).toString();
    return this;
  }
}

class Order extends Model {
  constructor(data) {
    super(data);
    data = data || {};
    this.oid = data.oid;
    this.order_status = data.order_status || 'processing';
    this.sku = data.sku;
    this.email = data.email;
    this.token = data.token;
    this.downloads = data.downloads || 0;
  }
}

module.exports = Order;