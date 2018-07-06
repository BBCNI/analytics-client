var constants = require('./constants');
var ClientJS = require('clientjs');
var axios = require('axios');

var client = new window.ClientJS();

var settings = {};

function init(options) {
  window.clearInterval(settings.heartbeatInterval);
  window.clearTimeout(settings.heartbeatTimeout);
  settings.projectName = options.projectName;
  settings.secondaryProject = options.secondaryProject || options.pageName || options.projectName;
  settings.sentEvents = {};
  axios.post(constants.ANALYTICS_URL + '/events', Object.assign(options, {
    projectName: settings.projectName,
    secondaryProject: settings.secondaryProject,
    eventType: 'view',
    browser: client.getBrowserData(),
    screen: client.getScreenPrint(),
    mobile: client.isMobile(),
    fingerprint: client.getFingerprint(),
    referrer: document.referrer,
    version: 1
  }));

  settings.heartbeatCount = 0;
  settings.heartbeatTimeout = window.setTimeout(function () {
    heartbeat();
    settings.heartbeatInterval = window.setInterval(function () {
      heartbeat();
    }, 30000);
  }, 30000);
};

function error(data) {
  axios.post(constants.ANALYTICS_URL + '/events', Object.assign(data, {
    projectName: settings.projectName,
    secondaryProject: data.secondaryProject || settings.secondaryProject,
    eventType: 'error',
    version: 1,
    browser: client.getBrowserData(),
  }));
};

function heartbeat() {
  axios.post(constants.ANALYTICS_URL + '/events', {
    projectName: settings.projectName,
    secondaryProject: settings.secondaryProject,
    eventType: 'heartbeat',
    iteration: settings.heartbeatCount += 1,
    version: 1
  });
};

function count(data) {
  if (data.unique && settings.sentEvents[data.uniqueKey || data.eventName]) {
    return;
  }

  settings.sentEvents[data.uniqueKey || data.eventName] = true;

  axios.post(constants.ANALYTICS_URL + '/events', Object.assign(data, {
    projectName: settings.projectName,
    secondaryProject: settings.secondaryProject,
    eventType: data.eventType || 'count',
    eventName: data.eventName
  })).catch(function () {
    settings.sentEvents[data.uniqueKey || data.eventName] = false;
  });
};

module.exports = { init: init, count: count, error: error };