const config = require('../config');
const _ = require('lodash');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const Database = require('../server/db');

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

const db = new Database(config.database.name, () => {
  console.log(`Database connection established to ${db.database}`);
  startWebServer(db, {
    id: 1
  });
});

function startWebServer(db, worker) {
  console.info('startWebServer', worker);
  let server = app.listen(7678, 'localhost', () => {
    console.info('Node server %s started at http://%s:%s',
      worker.id,
      server.address().address,
      server.address().port
    );
  });
  server.db = db;
  sigint.addTask(next => {
    server.close(() => {
      console.info('Closed out remaining connections (id: %s).', worker.id);
      next();
    });
  });
}
