module.exports = download;

function download(token, user) {
  $.ajax({
    type: 'PATCH',
    contentType: 'application/json',
    headers: {
      Authorization: user.getSignInUserSession().getIdToken().jwtToken
    },
    url: 'https://vgqi0l2sad.execute-api.us-west-2.amazonaws.com/prod/order?t=' + token,
    success: json => {
      document.location.href = json.body;
    },
    error: error => {
      console.error(error);
    }
  });
}