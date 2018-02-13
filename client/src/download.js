import account from './account.jsx';
import _ from 'lodash';

module.exports = {
  ownedDeck: ownedDeck,
  withToken: withToken
};

function ownedDeck(user, oid) {
  if (!user) {
    return location.href = '/';
  }
  let headers = account.apiHeaders();
  headers['Content-Type'] = 'application/json';
  axios({
    method: 'PATCH',
    headers: {
      Authorization: user.getSignInUserSession().getIdToken().jwtToken
    },
    url: 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?o=' + oid
  }).then(() => {
    document.location.href = json.body.downloadUrl;
  }).catch(console.error);
}

function withToken(token, user, autoDownload) {
  if (!user) {
    return location.href = '/';
  }
  let headers = account.apiHeaders();
  headers['Content-Type'] = 'application/json';
  axios({
    method: 'PATCH',
    headers: headers,
    url: 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?t=' + token
  }).then(() => {
    let downloadLink = document.querySelector('#download-link');
    downloadLink.removeAttribute('hidden');
    downloadLink.setAttribute('href', json.body.downloadUrl);
    downloadLink.innerText = 'Download ' + json.body.deck.title;
    if (autoDownload === true) {
      document.location.href = json.body.downloadUrl;
    }
  }).catch(console.error);
}