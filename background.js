var URL = 'https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/';
var enabled = false;
var listeners = {};

var currier = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);

  return function() {
    return fn.apply(this, args.concat(
      Array.prototype.slice.call(arguments, 0)));
  };
};

function genericLogger(name, url, ...args) {
  console.group();
  console.log(`Event fired: browser.${name}`);
  console.log(`Arguments: %o`, args.length === 1 ? args[0] : args);
  console.info(url);
  console.groupEnd();
}

function isEvent(obj) {
  let keys = Object.keys(obj);
  if (keys.includes('hasListener') &&
      keys.includes('addListener') &&
      keys.includes('removeListener')) {
    return true;
  }
  return false;
}

function events(enable) {
  for (let api_name of Object.keys(browser)) {
    if (!browser[api_name]) {
      console.log(`Skipping: ${api_name}`);
      continue;
    }

    for (let method_name of Object.keys(browser[api_name])) {
      let method = browser[api_name][method_name];
      if (method && isEvent(method)) {
          let name = `${api_name}.${method_name}`;
          let url = `${URL}${api_name}/${method_name}/`;
          if (enable) {
            let listener = currier(currier(genericLogger, name), url);
            listeners[url] = listener;
            if (api_name === 'webRequest') {
              method.addListener(listener, {urls: ["<all_urls>"]});
            } else {
              method.addListener(listener);
            }
            console.log(`Added listener to: ${name}`);
          } else {
            let listener = listeners[url];
            method.removeListener(listener);
            delete listeners[url];
            console.log(`Removed listener from: ${name}`);
          }
      }
    }
  }
}

function toggle() {
  if (enabled) {
    console.log('Turning off every event.');
    browser.browserAction.setBadgeText({text: 'OFF'});
    enabled = false;
  } else {
    console.log('Turning on every event.');
    browser.browserAction.setBadgeText({text: 'ON'});
    enabled = true;
  }
  events(enabled);
  return enabled;
}

browser.browserAction.setBadgeText({text: 'OFF'});
