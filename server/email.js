'use strict';

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'us-west-2'
});
const ses = new AWS.SES({
  apiVersion: '2010-12-01'
});

module.exports = {
  send: send
};

function send(to, subject, body) {
  return new Promise((resolve, reject) => {
    let mailConfig = {
      Source: 'slidetherapy@gmail.com',
      Destination: {
        ToAddresses: ['james.m.byrum@gmail.com']
      },
      Message: {
        Subject: {
          Data: 'Your Slide Therapy Download'
        },
        Body: {
          Html: {
            Data: '<p>html link here</p>'
          },
          Text: {
            Data: 'link here'
          }
        }
      }
    };
    // console.log(mailConfig);
    ses.sendEmail(mailConfig, function(err, data) {
      if (err) {
        return reject(err);
      }
      console.log(data);
      resolve(data);
    });
  });
}
