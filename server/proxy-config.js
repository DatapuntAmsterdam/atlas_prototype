const fs = require('fs');
const path = require('path');
const argv = require('./argv');

let proxyConfig = {};
const proxyPath = path.resolve((argv && argv.proxyConfig) || 'proxy.conf.prod.js');

if (fs.existsSync(proxyPath)) {
  proxyConfig = require(proxyPath); // eslint-disable-line global-require
}

module.exports = proxyConfig;
