const AWS = require('aws-sdk');
const ses = new AWS.SES({
  region: 'us-west-2',
  apiVersion: '2010-12-01'
});
const dynamo = new AWS.DynamoDB.DocumentClient();
const _ = require('lodash');
const jwt = require('jsonwebtoken');

exports.handler = (event, context, callback) => {
  let eventJson;
  if (event.oid) {
    eventJson = event;
  } else {
    try {
      eventJson = JSON.parse(event.Records[0].Sns.Message);
    } catch (e) {
      return callback(e);
    }
  }
  const get = {
    TableName: 'orders',
    Key: {
      'oid': eventJson.oid
    }
  };
  dynamo.get(get, (getError, data) => {
    if (getError) {
      return callback(getError);
    }
    sendFile(data.Item).then(() => {
      callback();
    }).catch(callback);
  });
};

function encrypt(json, password, expiresIn) {
  console.log('encrypt', json, password, expiresIn);
  return new Promise((resolve, reject) => {
    let tokenConfig = {};
    if (expiresIn) {
      tokenConfig.expiresIn = expiresIn;
    }
    jwt.sign(json, (password || process.env.jwtSecret), tokenConfig, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

function decrypt(token, password) {
  console.log('decrypt', token, password);
  return new Promise((resolve, reject) => {
    jwt.verify(token, (password || process.env.jwtSecret), (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}

function sendFile(order) {
  console.log('sendFile', _.omit(order, 'charge'));
  return encrypt({
    oid: order.oid,
    token: order.token,
    created: order.created.valueOf()
  }).then(jwt => {
    let url = process.env.webUrl + '/download?t=' + jwt;
    let html = `
      Thanks for purchasing Slide Therapy 2018!
      <br>
      <a href="${url}">Click here to download your deck</a>
    `;
    return send(order.email, 'Thank you!', html);
  });
}

function send(to, subject, body, textBody) {
  return new Promise((resolve, reject) => {
    if (!to || !subject || !body) {
      return reject(new Error('missing to, subject, or body field'));
    }
    if (!textBody) {
      textBody = body.replace(/(<br>)/ig,' ');
      textBody = textBody.replace(/(<br\/>)/ig,' ');
      textBody = textBody.replace(/(<br\ \/>)/ig,' ');
      textBody = textBody.replace(/(<([^>]+)>)/ig,'');
    }

    let params = {
      Destination: {
        ToAddresses: [
          to,
        ]
      },
      Message: {
        Body: {
          Html: {
            Data: body,
            Charset: 'UTF-8'
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8'
          }
        },
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        }
      },
      Source: process.env.supportEmailAddress,
      SourceArn: process.env.emailArn
    };
    // console.log(params);
    ses.sendEmail(params, (err, data) =>{
      if (err) {
        return reject(err, err.stack);
      }
      resolve(data);
    });
  });
}