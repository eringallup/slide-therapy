import ready from 'ready';
import { getAll as routes } from 'routes';

ready(() => {
  routes().forEach(route => {
    Router.route(route);
  });
  Router.ready();
  document.body.classList.remove('view-loading');
});
