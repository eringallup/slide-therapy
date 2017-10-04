const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};

function encrypt(json, password, expiresIn) {
  return new Promise((resolve, reject) => {
    let tokenConfig = {};
    if (expiresIn) {
      tokenConfig.expiresIn = expiresIn;
    }
    jwt.sign(json, (password || config.jwt.secret), tokenConfig, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

function decrypt(token, password) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, (password || config.jwt.secret), (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}