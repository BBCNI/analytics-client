const constants = require('./constants');
const ClientJS = require('clientjs');
const axios = require('axios');

const client = new window.ClientJS();

const settings = {};

const init = (options) => {
  window.clearInterval(settings.heartbeatInterval);
  window.clearTimeout(settings.heartbeatTimeout);
  settings.projectName = options.projectName;
  settings.secondaryProject = options.secondaryProject || options.pageName || options.projectName;
  settings.sentEvents = {};
  axios.post(`${constants.ANALYTICS_URL}/events`, Object.assign(options, {
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
  settings.heartbeatTimeout = window.setTimeout(() => {
    settings.heartbeat();
    settings.heartbeatInterval = window.setInterval(() => {
      settings.heartbeat();
    }, 30000);
  }, 30000);
};

const heartbeat = () => {
  axios.post(`${constants.ANALYTICS_URL}/events`, {
    projectName: settings.projectName,
    secondaryProject: settings.secondaryProject,
    eventType: 'heartbeat',
    iteration: settings.heartbeatCount += 1,
    version: 1
  });
};

const count = (data) => {
  if (data.unique && settings.sentEvents[data.eventName]) {
    return;
  }

  settings.sentEvents[data.eventName] = true;

  axios.post(`${constants.ANALYTICS_URL}/events`, Object.assign(data, {
    projectName: settings.projectName,
    secondaryProject: settings.secondaryProject,
    eventType: 'count',
    eventName: data.eventName
  })).catch(() => {
    settings.sentEvents[data.eventName] = false;
  });
};

module.exports = { init, count};