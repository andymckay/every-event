var URL = 'https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/';
var enabled = false;
var apis = {};
var apis_grouped = {};

var currier = function(fn) {
  var args = Array.prototype.slice.call(arguments, 1);

  return function() {
    return fn.apply(this, args.concat(
      Array.prototype.slice.call(arguments, 0)));
  };
};

function genericLogger(name, ...args) {
  console.log(`Event fired: browser.${name}`);
  console.log(`Arguments: %o`, args.length === 1 ? args[0] : args);
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

function populateAPIs() {
  for (let api_name of Object.keys(browser)) {
    if (!browser[api_name] || api_name === 'test') {
      continue;
    }
    for (let method_name of Object.keys(browser[api_name])) {
      let method = browser[api_name][method_name];
      if (method && isEvent(method)) {
        let name = `${api_name}.${method_name}`;
        apis[name] = {
          api_name: api_name,
          method_name: method_name,
          name: name,
          listener: null
        };
        if (!Object.keys(apis_grouped).includes(api_name)) {
          apis_grouped[api_name] = {
            url: `${URL}${api_name}/#Events`,
            methods: [],
            enabled: true
          };
        }
        apis_grouped[api_name].methods.push(apis[name]);
      }
    }
  }
}

function events(enable) {
    for (let key of Object.keys(apis)) {
      let api = apis[key];
      let method = browser[api.api_name][api.method_name];
      if (enable && apis_grouped[api.api_name].enabled) {
        let listener = currier(genericLogger, api.name);
        api.listener = listener;
        if (api.api_name === 'webRequest') {
          method.addListener(api.listener, {urls: ["<all_urls>"]});
        } else {
          method.addListener(api.listener);
        }
        console.log(`Added listener to: ${api.name}`);
      } else {
        if (api.listener) {
          method.removeListener(api.listener);
          api.listener = null;
          console.log(`Removed listener from: ${api.name}`);
        }
      }
    }
}

function toggle() {
  if (enabled) {
    console.log('Turning off enabled events.');
    browser.browserAction.setBadgeBackgroundColor({color: [217, 0, 0, 255]});
    browser.browserAction.setBadgeText({text: 'OFF'});
    enabled = false;
  } else {
    console.log('Turning on enabled event.');
    browser.browserAction.setBadgeBackgroundColor({color: 'green'});
    browser.browserAction.setBadgeText({text: 'ON'});
    enabled = true;
  }
  events(enabled);
  return enabled;
}

browser.contextMenus.create({
  id: "every-event",
  title: "Every Event",
  contexts: ["browser_action"]
});

function triggerAlarm() {
  browser.alarms.create('every-event', {delayInMinutes: 0.1});
}

populateAPIs();
browser.browserAction.setBadgeText({text: 'OFF'});
browser.browserAction.onClicked.addListener(() => {
  browser.tabs.create({"url": "/every.html"});
});
