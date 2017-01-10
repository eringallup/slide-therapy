'use strict';

const _ = require('underscore');
const charge = require('./charge');
const download = require('./download');

module.exports = [{
  method: 'GET',
  path: '/api/status',
  config: {
    handler: function(request, reply) {
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
    handler: function(request, reply) {
      let api = _.bind(apiResponse, this, request, reply);
      let token = request.body.token;
      let sku = request.body.sku;
      let uid = request.body.uid;
      let email = request.body.email;
      charge(token, sku, uid, email).then(function() {
        api(null, null);
      }, api);
    }
  }
}, {
  method: 'POST',
  path: '/api/download',
  config: {
    handler: function(request, reply) {
      let api = _.bind(apiResponse, this, request, reply);
      let token = request.body.token;
      let email = request.body.email;
      download(token, email).then(function() {
        api(null, null);
      }, api);
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
