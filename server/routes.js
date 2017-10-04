const _ = require('lodash');
const charge = require('slidetherapy/charge');
const token = require('slidetherapy/token');
const download = require('slidetherapy/download');
const email = require('slidetherapy/email');

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
      let db = request.connection.server.db;
      let token = request.body.token;
      let sku = request.body.sku;
      let email = request.body.email;
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
      token.decrypt(request.query.t).then(jwt => {
        let db = request.connection.server.db;
        download(db, jwt.oid, jwt.token, jwt.created).then(url => {
          reply.redirect(url);
        }).catch(downloadError => {
          console.error('Download Error', downloadError);
          reply.redirect('/');
        });
      }).catch(api);
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
