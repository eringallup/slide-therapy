import ready from 'slidetherapy/client/src/ready';
import { getAll as routes } from 'slidetherapy/client/src/routes';

ready(() => {
  routes().forEach(route => {
    Router.route(route);
  });
  Router.ready();
  document.body.classList.remove('view-loading');
});
