const constants = require('./constants');
const ClientJS = require('clientjs');
const axios = require('axios');

const client = new window.ClientJS();

const init = (options) => {
  this.projectName = options.projectName;
  this.secondaryProject = options.secondaryProject || options.projectName;
  this.sentEvents = {};
  axios.post(`${constants.ANALYTICS_URL}/events`, {
    projectName: this.projectName,
    secondaryProject: this.secondaryProject,
    eventType: 'view',
    browser: client.getBrowserData(),
    screen: client.getScreenPrint(),
    mobile: client.isMobile(),
    fingerprint: client.getFingerprint(),
    referrer: document.referrer,
    version: 1
  });

  this.heartbeatCount = 0;
  window.setTimeout(() => {
    this.heartbeat();
    window.setInterval(() => {
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

const count = ({ eventName, unique }) => {
  if (unique && this.sentEvents[eventName]) {
    return;
  }

  this.sentEvents[eventName] = true;

  axios.post(`${constats.ANALYTICS_URL}/events`, {
    projectName: this.projectName,
    secondaryProject: this.secondaryProject,
    eventType: 'count',
    eventName: eventName
  }).catch(() => {
    this.sentEvents[eventName] = false;
  });
};

const settings = {};

module = {
  init: init.bind(settings),
  count: count.bind(settings),
};

module.exports = module;