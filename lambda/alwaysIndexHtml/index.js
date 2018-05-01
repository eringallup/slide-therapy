/* eslint-disable */
'use strict';
const parseUri = require('./parseUri.js')

exports.handler = (event, context, callback) => {
  // Extract the request from the CloudFront event that is sent to Lambda@Edge
  const request = event.Records[0].cf.request;
  request.uri = parseUri(request.uri)
  return callback(null, request);
};
/* eslint-enable */
