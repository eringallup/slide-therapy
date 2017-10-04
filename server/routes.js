const _ = require('lodash');
const charge = require('./charge');
const download = require('./download');
const email = require('./email');

module.exports = [{
  method: 'GET',
  path: '/api/status',
  config: {
    handler: (request, reply) => {
      let api = _.bind(apiResponse, this, request, reply);
      api(null, {
        ok: true
      });
    }
  }
}, {
  method: 'POST',
  path: '/api/charge',
  config: {
    handler: (request, reply) => {
      let api = _.bind(apiResponse, this, request, reply);
      let token = request.body.token;
      let oid = request.body.oid;
      let sku = request.body.sku;
      let email = request.body.email;
      let db = request.connection.server.db;
      charge(db, token, oid, sku, email).then(() => {
        api(null, null);
      }).catch(api);
    }
  }
}, {
  method: 'GET',
  path: '/api/download',
  config: {
    handler: (request, reply) => {
      let oid = request.query.o;
      let token = request.query.t;
      let created = request.query.c;
      let db = request.connection.server.db;
      download(db, oid, token, created).then(url => {
        reply.redirect(url);
      }).catch(downloadError => {
        console.error('Download Error', downloadError);
        reply.redirect('/');
      });
    }
  }
}, {
  method: 'POST',
  path: '/api/email',
  config: {
    handler: (request, reply) => {
      let api = _.bind(apiResponse, this, request, reply);
      let db = request.connection.server.db;
      email.sendFile(db, request.body.oid).then(() => {
        api();
      }).catch(api);
    }
  }
}];

function apiResponse(request, reply, error, response, topLevel) {
  if (error) {
    console.error(error);
    reply.sendStatus(500);
  }
  reply.send(_.extend({
    data: response || error
  }, topLevel));
}
