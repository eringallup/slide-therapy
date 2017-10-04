const _ = require('lodash');
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
  config: {
    handler: (request, reply) => {
      let api = _.bind(apiResponse, this, request, reply);
      let orderService = request.connection.server.orderService;
      let token = request.body.token;
      let sku = request.body.sku;
      let email = request.body.email;
      charge(orderService, token, oid, sku, email).then(() => {
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
        let orderService = request.connection.server.orderService;
        download(orderService, jwt.oid, jwt.token, jwt.created).then(url => {
          reply.redirect(url);
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
