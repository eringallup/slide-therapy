const config = require('../config');
const token = require('slidetherapy/token');

const aws = require('aws-sdk');
const ses = new aws.SES({
  region: 'us-west-2',
  apiVersion: '2010-12-01'
});

module.exports = {
  send: send,
  sendFile: sendFile,
  getIdentityPolicy: getIdentityPolicy
};

function getIdentityPolicy() {
  return new Promise((resolve, reject) => {
    ses.listIdentityPolicies({
      Identity: config.email.from.support.arn
    }, (listError, listData) => {
      if (listError) {
        return reject(listError);
      }
      ses.getIdentityPolicies({
        Identity: config.email.from.support.arn,
        PolicyNames: listData.PolicyNames
      }, (getError, getData) => {
        if (getError) {
          return reject(getError);
        }
        try {
          let policyData = JSON.parse(getData.Policies[listData.PolicyNames[0]]).Statement[0];
          resolve(policyData);
        } catch (e) {
          reject(e);
        }
      });
    });
  });
}

function sendFile(db, oid) {
  // console.log('-- sendFile --', oid);
  return db.getOrder(oid).then(order => {
    let text = oid + order.token + order.created.valueOf();
    return token.encrypt({
      oid: oid,
      token: order.token,
      created: order.created.valueOf()
    }).then(jwt => {
      let url = config.web.api + '/download?t=' + jwt;
      let html = `
        Thanks for purchasing Slide Therapy 2017!
        <br>
        <a href="${url}">Click here to download your deck</a>
      `;
      return send(order.email, 'Thank you!', html);
    });
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
      Source: config.email.from.support.email,
      SourceArn: config.email.from.support.arn
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
