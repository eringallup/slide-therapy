/****************************************************************
Router.js

@description: router for single page apps
@author: Jimmy Byrum <me@jimmybyrum.com>
@version: 1.0.0

# URLs
You need to 'route' urls before you can use them.

Router.route({
  url: '/search/:term/:geo',
  controller: function(self, url) {
    // what to do...?
    // take actions related to a search results page
    // self.params with have values for "term" and "geo"
  }
});
****************************************************************/

;(function() {
  window.Router = function() {
    var version = '1.0.0',
      urls = {},
      baseUrl = document.location.protocol + '//' + document.location.host,
      view = undefined,
      previous = undefined,
      online = false,
      beforeLoad = function() {},
      afterLoad = function() {};

    function encode(str) {
      str = encodeURIComponent(str);
      str = str.replace(/%20/g, '+');
      str = str.replace(/%2F/g, '/');
      return str;
    }

    function decode(str) {
      str = str.replace(/\//g, '%2F');
      str = str.replace(/\+/g, '%20');
      str = decodeURIComponent(str);
      return str;
    }

    // sets up the urls array
    function router(config) {
      // console.info('Router.router()', config);
      if (!config.controller) {
        config.controller = function() {};
      }
      urls[config.url] = config;
    }

    // figures out which view we're on and calls that view's controller
    function loader(e) {
      if (!online) {
        return false;
      }

      var url = location.pathname;

      var target;
      if (e && e instanceof MouseEvent) {
        target = e.target;
      }

      if (target) {
        url = target.href;
        if (typeof url !== 'string') {
          return false;
        }
      }

      url = url.replace(baseUrl, '');

      var shouldAct = false;
      // console.debug('previous: ' + previous);
      // console.debug('url:      ' + url);
      if (previous !== undefined) {
        previous = decode(previous);
      }
      // console.debug(url === previous);
      if (url === previous) {
        return false;
      }

      for (var path in urls) {
        var regex;
        var pathSplit = path.split(':');
        if (pathSplit.length > 1) {
          var basePath = pathSplit.shift();
          regex = new RegExp('^' + basePath);
        } else {
          regex = new RegExp('^' + path + '\/?$');
        }
        if (url.match(regex)) {
          // console.log('match', path, regex);
          shouldAct = true;
          view = urls[path];
          if (view !== undefined) {
            previous = url;
          }
          view.params = {};
          var urlParts = url.split('/');
          urlParts.splice(0, 2);
          pathSplit.forEach(function(part, idx) {
            view.params[part] = urlParts[idx];
          });
          view.controller(view, url);
          break;
        }
      }

      // console.log('shouldAct', shouldAct, view);
      if (shouldAct) {
        e && e.preventDefault();
        beforeLoad(url, previous);
        if (target) {
          setTimeout(function() {
            window.history.pushState({}, document.title, url);
          });
        }
        afterLoad(url, previous);
      }
    }

    function ready(callback) {
      if (!'pushState' in window.history) {
        console.warn('Router:canManageHistory:', canManageHistory);
        return false;
      }
      online = true;
      loader();
      if (typeof callback === 'function') {
        callback();
      }
    }

    // set up Router navigation listener
    document.onclick = loader;
    window.onpopstate = loader;

    return {
      version: version,
      urls: urls,
      route: router,
      ready: ready,
      load: loader,
      baseUrl: baseUrl,
      reload: function() { loader(null, true); },
      beforeLoad: function(fn) { beforeLoad = fn; },
      afterLoad: function(fn) { afterLoad = fn; }
    }
  }();
}());