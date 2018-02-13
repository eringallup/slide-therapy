import ready from './ready';

ready(() => {
  require('./routes').forEach(route => {
    Router.route(route);
  });
  Router.ready();
  document.body.classList.remove('view-loading');
});
