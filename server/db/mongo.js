const config = require('../../config');
const { Database } = require('slidetherapy/db/database');
const mongo = require('mongodb').MongoClient;
const _ = require('lodash');

class MongoDB extends Database {
  constructor(database, onConnect) {
    super(database, onConnect);
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
    return mongo.connect(config.database.host + this.database).then(connection => {
      console.log(`Database connection established to ${config.database.host}${this.database}`);
      this.db = connection;
      return this;
    });
  }

  close() {
    return this.db.close();
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
      return doc.value && doc.value.count;
    });
  }

  getOrder(oid) {
    let collection = this.db.collection('orders');
    return collection.findOne({
      oid: oid
    });
  }

  getDownload(oid) {
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
      return doc.value;
    });
  }

  saveOrder(orderDoc) {
    // console.info('saveOrder', orderDoc);
    let collection = this.db.collection('orders');
    return collection.insertOne(orderDoc);
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
}

module.exports = MongoDB;