module.exports = download;

function download(token) {
  $.ajax({
    type: 'GET',
    url: '/api/download',
    data: {
      t: token
    },
    success: json => {
      document.location.href = json.data;
    },
    error: error => {
      console.error(error);
    }
  });
}