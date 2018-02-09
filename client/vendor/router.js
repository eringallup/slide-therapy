var online = false;
var urls = {};
var baseUrl = document.location.protocol + '//' + document.location.host;
var maxNodes = 5;
var view, previous;

window.Router = {
  version: 'PACKAGE_VERSION',
  currentView: function() {
    return view;
  },
  go: go,
  urls: urls,
  route: router,
  ready: ready,
  load: loader,
  baseUrl: baseUrl,
  online: online,
  maxNodes: maxNodes,
  setMaxNodes: function(nodes) { maxNodes = nodes; },
  reload: function() { loader(null, true); },
  beforeLoad: beforeLoad,
  afterLoad: afterLoad,
  beforeLoad: function(fn) { beforeLoad = fn; },
  afterLoad: function(fn) { afterLoad = fn; }
};

function beforeLoad() {}
function afterLoad() {}

function router(routes) {
  // console.info('Router.router()', routes);
  // if only 1 route was passed in (as opposed to an array or routes)
  // put that single route into a 1 item array.
  if (typeof routes === 'object' && !routes[0]) {
    routes = [routes];
  }
  for (var i = 0; i < routes.length; i++) {
    var route = routes[i];
    if (!route.controller) {
      route.controller = function() {};
    }
    urls[route.url] = route;
  }
}

function getLink(node, level) {
  if (level > maxNodes) {
    return undefined;
  }
  if (!level) {
    level = 0;
  }
  // console.info('getLink', node && node.tagName);
  if (node.tagName === 'A') {
    return node;
  }
  var parentNode = node.parentNode;
  if (!parentNode) {
    return undefined;
  }
  level++;
  return getLink(parentNode, level);
}

// figures out which view we're on and calls that view's controller
function loader(e) {
  if (!online) {
    return false;
  }

  var url = location.pathname;

  var target;

  var target;
  if (e && e instanceof MouseEvent) {
    target = getLink(e.target);
  }
  // console.info('loader', target);

  if (target) {
    // console.log(url, target.href);
    url = target.href;
    if (typeof url !== 'string') {
      return false;
    }
  }

  url = url.replace(baseUrl, '');

  var shouldAct = false;
  // console.debug('previous: ' + previous);
  // console.debug('url:      ' + url);
  // console.debug(url === previous);
  if (url === previous) {
    return false;
  }

  for (var path in urls) {
    var regex;
    var pathSplit = path.split(':');
    if (pathSplit.length > 1) {
      var basePath = pathSplit.shift();
      basePath = basePath.replace(/\/$/, '');
      regex = new RegExp('^' + basePath);
    } else {
      regex = new RegExp('^' + path + '\/?$');
    }
    // console.info(url, regex);
    if (url.match(regex)) {
      // console.log('match', path, regex);
      shouldAct = true;
      view = urls[path];
      if (view !== undefined) {
        let previousUnload = previous && urls[previous] && urls[previous].onUnload;
        if (previousUnload) {
          previousUnload(urls[previous], previous);
        }
        previous = url;
      }
      view.params = {};
      var urlParts = url.split('/');
      urlParts.splice(0, 2);
      pathSplit.forEach(function(part, idx) {
        part = part.replace(/\/$/, '');
        view.params[part] = urlParts[idx];
      });
      view.query = {};
      if (location.search) {
        var queryString = location.search.substring(1);
        var queryPairs = queryString.split('&');
        for (var i = 0; i < queryPairs.length; i++) {
          var queryKeyValue = queryPairs[i].split('=');
          view.query[queryKeyValue[0]] = queryKeyValue[1];
        }
      }
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
        go(url, document.title);
      });
    }
    afterLoad(url, previous);
  }
}

function go(path, title, context) {
  window.history.pushState(context || {}, title, path);
  setTimeout(function() {
    loader();
  });
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
document.addEventListener('click', loader);
window.addEventListener('popstate', loader);
