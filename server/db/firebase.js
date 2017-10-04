const config = require('../../config/firebase.json');
const firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(config),
  databaseURL: 'https://' + config.project_id + '.firebaseio.com'
});
const db = firebaseAdmin.database();

module.exports = {
  getOid: getOid,
  saveOrder: saveOrder
};

function saveOrder(token, oid, sku, uid, email) {
  // console.info('-- saveOrder --');
  return new Promise((resolve, reject) => {
    let date = new Date();
    let order = {
      uid: uid,
      oid: oid,
      sku: sku.id,
      amount: sku.amountInCents,
      created: Math.round(date / 1000),
      created_at: date.toUTCString(),
      email: email,
      token: token
    };
    db.ref('orders/' + hash).set(order).then(resolve, reject);
  });
}

function getOid() {
  // console.info('-- getOid --');
  return new Promise((resolve, reject) => {
    let oidCounter = db.ref('counters');
    let oid;
    oidCounter.transaction(function(counters) {
      if (counters) {
        oid = ++counters.oid;
      }
      return counters;
    }, function(err) {
      if (err) {
        return reject(err);
      }
      resolve(oid);
    });
  });
}