$(document).ready(() => {
  require('./routes').forEach(route => {
    Router.route(route);
  });
  Router.ready();
  $('body').removeClass('view-loading');
});
