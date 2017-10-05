const _ = require('lodash');
const emailLib = require('slidetherapy/email');
const charge = require('slidetherapy/charge');
const token = require('slidetherapy/token');
const download = require('slidetherapy/download');

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
  validate: {
    body: {
      token: true,
      sku: true,
      email: true
    }
  },
  config: {
    handler: (request, reply) => {
      let api = _.bind(apiResponse, this, request, reply);
      let orderService = request.connection.server.orderService;
      let token = request.body.token;
      let sku = request.body.sku;
      let email = request.body.email;
      charge(orderService, token, sku, email).then(order => {
        api(null, order);
        emailLib.sendFile(orderService, order.oid);
      }).catch(api);
    }
  }
}, {
  method: 'POST',
  path: '/api/email',
  validate: {
    query: {
      oid: true
    }
  },
  config: {
    handler: (request, reply) => {
      let api = _.bind(apiResponse, this, request, reply);
      let orderService = request.connection.server.orderService;
      let oid = request.query.oid;
      emailLib.sendFile(orderService, oid).then(() => {
        api(null, null);
      }).catch(api);
    }
  }
}, {
  method: 'GET',
  path: '/api/download',
  validate: {
    query: {
      t: true
    }
  },
  config: {
    handler: (request, reply) => {
      let api = _.bind(apiResponse, this, request, reply);
      token.decrypt(request.query.t).then(jwt => {
        let orderService = request.connection.server.orderService;
        download(orderService, jwt.oid, jwt.token, jwt.created).then(url => {
          api(null, url);
        }).catch(downloadError => {
          console.error('Download Error', downloadError);
          reply.redirect('/');
        });
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
