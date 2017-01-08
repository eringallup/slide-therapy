'use strict';

const _ = require('underscore');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const crypto = require('crypto');

let firebaseAdmin = require('firebase-admin');
let cert = require('../config/slidetherapy-970be-firebase-adminsdk-82q2i-792b6f01d7.json');
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(cert),
  databaseURL: 'https://slidetherapy-970be.firebaseio.com'
});

let stripe = require('stripe')('sk_test_nkbxIavxItEv0Z8snt04O7h1');
let sigint = require('slidetherapy/sigint');
let app = express();

let database = firebaseAdmin.database();

let skus = {
  1: {
    id: 1,
    amountInCents: 2900
  }
};

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(helmet());
app.disable('x-powered-by');

app.use(function(request, reply, next) {
  // log each request
  let start = Date.now();

  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  reply.on('finish', function() {
    let duration = Date.now() - start;
    console.info('(%s) %s %sms', process.pid, request.url, duration);
  });
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'dev') {
    if (!request.headers.referer || request.headers.referer.indexOf('slidetherapy.com') < 0) {
      return reply.status(401).send('Unauthorized');
    }
  }
  next();
});

let routes = [{
  method: 'GET',
  path: '/api/status',
  config: {
    handler: function(request, reply) {
      apiResponse(null, {
        ok: true
      }, request, reply);
    }
  }
}, {
  method: 'POST',
  path: '/api/charge',
  config: {
    handler: function(request, reply) {
      getOid(function(err, oid) {
        if (err) {
          return apiResponse(err, null, request, reply);
        }

        let token = request.body.token;
        let uid = request.body.uid;
        let email = request.body.email;
        let sku = request.body.sku;

        chargeStripe(token, oid, sku, uid, email).then(function() {
          apiResponse(null, null, request, reply);
        }, function(err) {
          apiResponse(err, err, request, reply);
        });
      });
    }
  }
}];

function chargeStripe(token, oid, sku, uid, email) {
  return new Promise((resolve, reject) => {
    let skuData = skus[sku];
    let hash = crypto.createHash('md5').update(oid + email + token).digest('hex')
    let charge = {
      currency: 'usd',
      amount: skuData.amountInCents,
      source: token,
      description: 'Slide Therapy',
      metadata: {
        oid: oid,
        sku: skuData.id,
        uid: uid,
        email: email
      }
    };

    stripe.charges.create(charge, function(err, charge) {
      if (err) {
        return reject(err);
      }

      let date = new Date();
      let order = {
        uid: uid,
        oid: oid,
        sku: skuData.id,
        amount: skuData.amountInCents,
        created: Math.round(date / 1000),
        created_at: date.toUTCString(),
        email: email,
        token: token
      };
      database.ref('orders/' + hash).set(order).then(resolve, reject);
    });
  });
}

function getOid(callback) {
  let oidCounter = database.ref('counters');
  let oid;
  oidCounter.transaction(function(counters) {
    if (counters) {
      oid = ++counters.oid;
    }
    return counters;
  }, function(err) {
    callback(err, oid);
  });
}

routes.forEach(function(route) {
  // console.log(route.method, route.path, route.auth);
  if (route.middleware) {
    app[route.method.toLowerCase()](route.path, route.middleware, route.config.handler);
  } else if (route.auth) {
    let authMiddleware = _.partial(middleware.verifyUser, route.auth);
    app[route.method.toLowerCase()](route.path, authMiddleware, route.config.handler);
  } else {
    app[route.method.toLowerCase()](route.path, route.config.handler);
  }
});

function startWebServer(worker) {
  console.info('startWebServer', worker);
  let server = app.listen(7678, 'localhost', function() {
    console.info('Node server %s started at http://%s:%s',
      worker.id,
      server.address().address,
      server.address().port
    );
  });
  sigint.addTask(function(next) {
    server.close(function() {
      console.info('Closed out remaining connections (id: %s).', worker.id);
      next();
    });
  });
}

function apiResponse(error, response, request, reply, topLevel) {
  if (error) {
    console.error(error);
    reply.sendStatus(500);
  }
  reply.send(_.extend({
    data: response || error
  }, topLevel));
}

startWebServer({
  id: 1
});
