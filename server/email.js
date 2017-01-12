'use strict';

const config = require('../config/config.json');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport([
  'smtps://',
  config.email.smtp.username,
  ':',
  config.email.smtp.password,
  '@email-smtp.us-west-2.amazonaws.com'
].join(''));
const db = require('./db');

// setTimeout(function() {
//   send('james.m.byrum@gmail.com', 'testing', '<strong>html<br>body</strong><br><a href="http://slidetherapy.com">website</a>').then(function() {
//     console.info('success');
//   }, function(err) {
//     console.error(err);
//   });
// }, 500);

module.exports = {
  send: send,
  sendFile: sendFile
};

function sendFile(oid) {
  // console.log('-- sendFile --', oid);
  return new Promise((resolve, reject) => {
    db.getOrder(oid).then(function(order) {
      let link = config.web.api + '/download?o=' + oid + '&t=' + order.token.replace('tok_', '') + '&c=' + order.created;
      let html = `
        Thanks for purchasing Slide Therapy 2017!
        <br>
        <a href="${link}">Click here to download your deck</a>
      `;
      send(order.email, 'Thank you!', html),then(resolve, reject);
    }, reject);
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
    let mailOptions = {
      from: config.email.from.support,
      to: to,
      subject: subject,
      text: textBody,
      html: body
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return reject(error);
      }
      resolve(info && info.response);
    });
  });
}
