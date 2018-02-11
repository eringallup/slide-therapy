const _ = require('lodash');

module.exports = {
  ownedDeck: ownedDeck,
  withToken: withToken
};

function ownedDeck(user, oid) {
  if (!user) {
    return location.href = '/';
  }
  $.ajax({
    type: 'PATCH',
    contentType: 'application/json',
    headers: {
      Authorization: user.getSignInUserSession().getIdToken().jwtToken
    },
    url: 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?o=' + oid,
    success: json => {
      document.location.href = json.body.downloadUrl;
    },
    error: error => {
      console.error(error);
    }
  });
}

function withToken(token, user, autoDownload) {
  if (!user) {
    return location.href = '/';
  }
  $.ajax({
    type: 'PATCH',
    contentType: 'application/json',
    headers: {
      Authorization: user.getSignInUserSession().getIdToken().jwtToken
    },
    url: 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?t=' + token,
    success: json => {
      $('#download-link')
        .removeAttr('hidden')
        .attr('href', json.body.downloadUrl)
        .text('Download ' + json.body.deck.title);
      if (autoDownload === true) {
        document.location.href = json.body.downloadUrl;
      }
    },
    error: error => {
      console.error(error);
    }
  });
}