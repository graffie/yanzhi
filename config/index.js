/**!
 * yanzhi - config/index.js
 */

'use strict';

/**
 * Module dependencies.
 */

var ms = require('humanize-ms');
var mkdirp = require('mkdirp');
var copy = require('copy-to');
var path = require('path');
var fs = require('fs');

var version = require('../package.json').version;
var rootdir = path.dirname(__dirname);

var config = {
  version: version,
  port: 7001,
  serverHost: 'http://local.crazyapp.net',
  enableCluster: false,
  debug: true,
  logdir: path.join(rootdir, '.tmp', 'logs'),
  rootdir: rootdir,
  viewCache: false,
  sessionKey: 'yz.sid',
  keys: ['yanzhi dev session secret.', 'xxxxkwefwu'],
  cookieTimeout: ms('15d'),
  jsonLimit: '20mb',
  imageStore: 'cdn-dev.crazyapp.net',

  mysql: {
    host: '127.0.0.1',
    port: 8080,
    user: 'user',
    password: 'password',
    database: 'yanzhidev',
    insecureAuth: true,
    connectionLimit: 5,
    multipleStatements: false,
    timeout: 10000,
  },

  oss: {
    accessKeyId: 'accessKeyId',
    accessKeySecret: 'accessKeySecret',
    bucket: 'yzhzdev',
    region: 'oss-cn-hangzhou',
  },

  weixin: {
    appId: 'appId',
    appSecret: 'appSecret',
  },

  redis: {
    host: '127.0.0.1',
    port: 8081,
    debug: false,
    speedFirst: true,
    prefix: 'yz_dev:',
    pass: '',
  },

  hashLength: 10,
};

// Load config/config.js, everything in config.js will cover the same key in index.js
var customConfig = path.join(rootdir, 'config/config.js');
if (fs.existsSync(customConfig)) {
  copy(require(customConfig)).override(config);
}

var testConfig = path.join(rootdir, 'config/config_test.js');
if (process.env.NODE_ENV === 'test') {
  copy(require(testConfig)).override(config);
}

mkdirp.sync(config.logdir);

module.exports = config;
