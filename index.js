const constants = require('./constants');
const ClientJS = require('clientjs');
const axios = require('axios');

const client = new window.ClientJS();

const init = (options) => {
  window.clearInterval(this.heartbeatInterval);
  window.clearTimeout(this.heartbeatTimeout);
  this.projectName = options.projectName;
  this.secondaryProject = options.secondaryProject || options.pageName || options.projectName;
  this.sentEvents = {};
  axios.post(`${constants.ANALYTICS_URL}/events`, Object.assign(options, {
    projectName: this.projectName,
    secondaryProject: this.secondaryProject,
    eventType: 'view',
    browser: client.getBrowserData(),
    screen: client.getScreenPrint(),
    mobile: client.isMobile(),
    fingerprint: client.getFingerprint(),
    referrer: document.referrer,
    version: 1
  }));

  this.heartbeatCount = 0;
  this.heartbeatTimeout = window.setTimeout(() => {
    this.heartbeat();
    this.heartbeatInterval = window.setInterval(() => {
      this.heartbeat();
    }, 30000);
  }, 30000);
};

const heartbeat = () => {
  axios.post(`${constants.ANALYTICS_URL}/events`, {
    projectName: this.projectName,
    secondaryProject: this.secondaryProject,
    eventType: 'heartbeat',
    iteration: this.heartbeatCount += 1,
    version: 1
  });
};

const count = (data) => {
  if (data.unique && this.sentEvents[data.eventName]) {
    return;
  }

  this.sentEvents[data.eventName] = true;

  axios.post(`${constants.ANALYTICS_URL}/events`, Object.assign(data, {
    projectName: this.projectName,
    secondaryProject: this.secondaryProject,
    eventType: 'count',
    eventName: data.eventName
  })).catch(() => {
    this.sentEvents[data.eventName] = false;
  });
};

const settings = {};

module = {
  init: init.bind(settings),
  count: count.bind(settings),
};

module.exports = module;