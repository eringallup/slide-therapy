'use strict';

const _ = require('underscore');
const charge = require('./charge');
const download = require('./download');
const email = require('./email');

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
  method: 'GET',
  path: '/api/download',
  config: {
    handler: function(request, reply) {
      let oid = request.query.o;
      let token = request.query.t;
      let created = request.query.c;
      download(oid, token, created).then(function(url) {
        reply.redirect(url);
      }, function(downloadError) {
        console.error('Download Error', downloadError);
        reply.redirect('/');
      });
    }
  }
}, {
  method: 'POST',
  path: '/api/email',
  config: {
    handler: function(request, reply) {
      let api = _.bind(apiResponse, this, request, reply);
      email.sendFile(request.body.oid).then(function() {
        api();
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
