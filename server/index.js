'use strict';

const _ = require('underscore');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
var stripe = require("stripe")('sk_test_nkbxIavxItEv0Z8snt04O7h1');
let sigint = require('slidetherapy/sigint');
let app = express();

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

  reply.header("Access-Control-Allow-Origin", "*");
  reply.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

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
      let charge = {
        currency: 'usd',
        amount: 2900,
        source: request.body.token,
        description: 'Slide Therapy',
        metadata: {
          oid: request.body.oid,
          email: request.body.email
        }
      };
      stripe.charges.create(charge, function(err, charge) {
        apiResponse(err, charge, request, reply);
      });
    }
  }
}];

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
