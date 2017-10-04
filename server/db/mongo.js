const config = require('../../config');
const { Database } = require('./database');
const { Order } = require('../schema/order');
const mongo = require('mongodb').MongoClient;
const _ = require('lodash');

class MongoDB extends Database {
  constructor(database, onConnect) {
    super(database, onConnect);
  }

  getOid() {
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

  getOrder(oid) {
    // console.info('getOrder', oid);
    let collection = this.db.collection('orders');
    return collection.findOne({
      oid: oid
    }).then(doc => {
      return new Order(doc);
    });
  }

  saveOrder(token, oid, sku, email) {
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

  completeOrder(oid, charge) {
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
      return doc.value;
    });
  }

  setup() {
    return this.db.listCollections().toArray().then(collections => {
      let counters = _.find(collections, {
        name: 'counters'
      });
      if (counters) {
        return Promise.resolve();
      }
      return this.db.collection('counters').insertOne({
        type: 'oid',
        count: 0
      }).then(() => {
        return this.db.collection('counters').createIndex('type', {
          type: 1
        }, {
          unique: true,
          background: true
        }).then(() => {
          return this.db.createCollection('orders').then(() => {
            return this.db.collection('orders').createIndex('oid', {
              oid: 1
            }, {
              unique: true,
              background: true
            });
          });
        });
      });
    });
  }

  drop() {
    if (this.database === config.database.name) {
      return Promise.reject(new Error('cannot drop production database.'));
    }
    return this.db.dropDatabase();
  }

  connect() {
    return mongo.connect('mongodb://localhost:27017/' + this.database).then(db => {
      this.db = db;
    });
  }

  close() {
    return this.db.close();
  }
}

module.exports = MongoDB;