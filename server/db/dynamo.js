const _ = require('lodash');
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB({
  region: 'us-west-2',
  apiVersion: '2012-08-10'
});

module.exports = {
  listTables: listTables,
  getOid: getOid,
  getOrder: getOrder,
  saveOrder: saveOrder,
  completeOrder: completeOrder
};

function listTables() {
  return new Promise((resolve, reject) => {
    db.listTables({}, (err, data) => {
      console.log(err, data);
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function orderQuery(query) {
  // console.info('-- orderQuery --', query);
  return new Promise((resolve, reject) => {
    db.get(query, function(err, order) {
      if (err) {
        return reject(err);
      }
      resolve(order && order.Item);
    });
  });
}

function getOrder(oid) {
  // console.info('-- getOrder --', oid);
  return new Promise((resolve, reject) => {
    let query = {
      TableName: 'orders',
      Key: {
        oid: parseInt(oid, 10)
      }
    };
    orderQuery(query).then(resolve, reject);
  });
}

function saveOrder(token, oid, sku, uid, email) {
  // console.info('-- saveOrder --');
  return new Promise((resolve, reject) => {
    let date = new Date();
    let update = {
      TableName: 'orders',
      Item: {
        uid: uid,
        oid: oid,
        order_status: 'processing',
        sku: sku.id,
        amount: sku.amountInCents,
        created: Math.round(date / 1000),
        created_at: date.toUTCString(),
        email: email,
        token: token
      }
    };
    db.put(update, function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function completeOrder(oid, charge) {
  // console.info('-- completeOrder --');
  return new Promise((resolve, reject) => {
    let query = {
      TableName: 'orders',
      Key: {
        oid: oid
      },
      UpdateExpression: 'set order_status = :status, charge = :charge',
      ExpressionAttributeValues: {
        ':status': 'complete',
        ':charge': charge
      },
      ReturnValues: 'UPDATED_NEW'
    };
    db.update(query, function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function getOid() {
  // console.info('-- getOid --');
  return new Promise((resolve, reject) => {
    let query = {
      TableName: 'counters',
      Key: {
        id: 'oid'
      }
    };
    db.get(query, function(err) {
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
      db.update(update, function(updateError, data) {
        if (updateError) {
          return reject(updateError);
        }
        resolve(data && data.Attributes.currentCount);
      });
    });
  });
}