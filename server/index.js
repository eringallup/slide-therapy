const config = require('../config');
const _ = require('lodash');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Database = require('slidetherapy/db');
const OrderService = require('slidetherapy/services/order');
const sigint = require('slidetherapy/sigint');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(helmet());
app.disable('x-powered-by');

app.use((request, reply, next) => {
  // log each request
  let start = Date.now();

  reply.header('Access-Control-Allow-Origin', '*');
  reply.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  reply.on('finish', () => {
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

require('./routes').forEach(route => {
  let method = route.method.toLowerCase();
  // console.log(route.method, route.path, route.auth);
  if (route.middleware) {
    app[method](route.path, route.middleware, route.config.handler);
  } else if (route.validate) {
    app[method](route.path, _.bind(routeValidation, this, route), route.config.handler);
  } else {
    app[method](route.path, route.config.handler);
  }
});

function routeValidation(route, request, reply, next) {
  let hasRequiredData = true;
  _.each([
    'query',
    'body'
  ], type => {
    _.each(route.validate[type], (val, key) => {
      let requestValue = request[type] && request[type][key];
      if (!requestValue) {
        hasRequiredData = false;
      }
    });
  });
  if (!hasRequiredData) {
    return reply.status(400).end('Bad Request');
  }
  next();
}

const db = new Database(config.database.name, () => {
  startWebServer({
    id: 1
  });
});

function startWebServer(worker) {
  console.info('startWebServer', worker);
  let server = app.listen(7678, config.web.domain, () => {
    console.info('Node server %s started at http://%s:%s',
      worker.id,
      server.address().address,
      server.address().port
    );
  });
  server.db = db;
  server.orderService = new OrderService(db);
  sigint.addTask(next => {
    server.close(() => {
      console.info('Closed out remaining connections (id: %s).', worker.id);
      next();
    });
  });
}
