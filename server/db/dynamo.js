const config = require('../../config');
const { Database } = require('slidetherapy/db/database');
const _ = require('lodash');
const AWS = require('aws-sdk');
const ENDPOINT = 'https://dynamodb.us-west-2.amazonaws.com';
AWS.config.update({
  region: 'us-west-2',
  endpoint: ENDPOINT
});
const dynamo = new AWS.DynamoDB.DocumentClient();

class DynamoDB extends Database {
  constructor(database, onConnect) {
    super(database, onConnect);
  }

  setup() {
    return Promise.resolve();
  }

  drop() {
    return Promise.resolve();
  }

  connect() {
    this.db = dynamo;
    console.log(`Database connection established to ${ENDPOINT}`);
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }

  getOid() {
    // console.info('getOid');
    return new Promise((resolve, reject) => {
      let query = {
        TableName: 'counters',
        Key: {
          type: 'oid'
        }
      };
      dynamo.get(query, err => {
        if (err) {
          return reject(err);
        }
        let update = _.extend({
          UpdateExpression: 'set currentCount = currentCount + :val',
          ExpressionAttributeValues: {
            ':val': 1
          },
          ReturnValues: 'UPDATED_NEW'
        }, query);
        // console.log('update:', update);
        dynamo.update(update, (updateError, data) => {
          if (updateError) {
            return reject(updateError);
          }
          let currentCount = data && data.Attributes && data.Attributes.currentCount;
          if (!isNaN(currentCount)) {
            currentCount = parseInt(currentCount, 10);
          }
          resolve(currentCount);
        });
      });
    });
  }

  getOrder(oid) {
    // console.info('getOrder', oid);
    return new Promise((resolve, reject) => {
      let query = {
        TableName: 'orders',
        Key: {
          oid: parseInt(oid, 10)
        }
      };
      dynamo.get(query, (err, order) => {
        if (err) {
          return reject(err);
        }
        resolve(order && order.Item);
      });
    });
  }

  getDownload(oid) {
    // console.info('getDownload');
    return new Promise((resolve, reject) => {
      let query = {
        TableName: 'orders',
        Key: {
          oid: parseInt(oid, 10)
        }
      };
      dynamo.get(query, err => {
        if (err) {
          return reject(err);
        }
        let update = _.extend({
          UpdateExpression: 'set downloads = downloads + :val',
          ExpressionAttributeValues: {
            ':val': 1
          },
          ReturnValues: 'UPDATED_NEW'
        }, query);
        // console.log('update:', update);
        dynamo.update(update, (updateError, order) => {
          if (updateError) {
            return reject(updateError);
          }
          resolve(order && order.Item);
        });
      });
    });
  }

  saveOrder(orderDoc) {
    // console.info('saveOrder');
    return new Promise((resolve, reject) => {
      orderDoc.order_status = orderDoc.status;
      delete orderDoc.status;
      orderDoc.created = orderDoc.created.toString();
      orderDoc.modified = orderDoc.modified.toString();
      let update = {
        TableName: 'orders',
        Item: orderDoc
      };
      dynamo.put(update, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  completeOrder(oid, charge) {
    // console.info('completeOrder');
    return new Promise((resolve, reject) => {
      let query = {
        TableName: 'orders',
        Key: {
          oid: oid
        },
        UpdateExpression: 'set order_status = :status, charge = :charge, modified = :modified',
        ExpressionAttributeValues: {
          ':status': 'complete',
          ':charge': charge,
          ':modified': new Date().toString()
        },
        ReturnValues: 'UPDATED_NEW'
      };
      dynamo.update(query, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
    });
  }
}

module.exports = DynamoDB;