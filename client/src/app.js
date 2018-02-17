import ready from 'slidetherapy/client/src/ready';

ready(() => {
  require('slidetherapy/client/src/routes').forEach(route => {
    Router.route(route);
  });
  Router.ready();
  document.body.classList.remove('view-loading');
});
