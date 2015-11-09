/**!
 * yanzhi - config/config_test.js
 */

'use strict';

module.exports = {
  port: 3000,
  mysql: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 8080,
    user: process.env.DB_USERNAME || 'user',
    password: typeof process.env.DB_PASSWORD !== 'undefined' ?
                process.env.DB_PASSWORD : 'password',
    database: process.env.DB_DATABASE || 'yanzhitest',
    insecureAuth: true,
    connectionLimit: 5,
    multipleStatements: false,
    timeout: 10000
  }
};
