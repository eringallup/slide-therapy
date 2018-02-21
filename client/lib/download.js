import axios from 'axios';
import { apiHeaders } from 'lib/account';

module.exports = {
  ownedDeck: ownedDeck,
  withToken: withToken
};

function ownedDeck(user, oid) {
  if (!user) {
    return location.href = '/';
  }
  let headers = apiHeaders();
  headers['Content-Type'] = 'application/json';
  axios({
    method: 'PATCH',
    headers: headers,
    url: 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?o=' + oid
  }).then(json => {
    let body = json && json.data && json.data.body;
    document.location.href = body.downloadUrl;
  }).catch(console.error);
}

function withToken(token, user, autoDownload) {
  if (!user) {
    return location.href = '/';
  }
  let headers = apiHeaders();
  headers['Content-Type'] = 'application/json';
  axios({
    method: 'PATCH',
    headers: headers,
    url: 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?t=' + token
  }).then(json => {
    let body = json && json.data && json.data.body;
    let downloadLink = document.querySelector('#download-link');
    downloadLink.removeAttribute('hidden');
    downloadLink.setAttribute('href', body.downloadUrl);
    downloadLink.innerText = 'Download ' + body.deck.title;
    if (autoDownload === true) {
      document.location.href = body.downloadUrl;
    }
  }).catch(console.error);
}
