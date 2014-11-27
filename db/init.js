/**!
 * 5kw2 - db/init.js
 */

'use strict';

/**
 * Module dependencies.
 */

var config = require('../config');
var copy = require('copy-to');
var mysql = require('mysql');
var path = require('path');
var fs = require('fs');

var DDL = fs.readFileSync(path.join(__dirname, './ddl.sql'), 'utf8');

var conf = copy(config.mysql).to();
conf.multipleStatements = true;

var connection = mysql.createConnection(conf);

// force
if (process.argv[2] === 'force' && conf.database === 'birdmantest') {
  recreateTables();
} else {
  createTables();
}

/**
 * remove all exist tables
 * create tables with DDL
 */

function recreateTables() {
  connection.query('show tables;', function (err, rows) {
    onerror(err);
    rows.forEach(function (row) {
      DDL = 'DROP TABLE ' + row[Object.keys(row)[0]] + ' CASCADE;\n' + DDL;
    });
    createTables();
  });
}

/**
 * create tables with DDL
 */

function createTables() {
  connection.query(DDL, function (err, res) {
    onerror(err);
    process.exit(0);
  });
}

function onerror(err) {
  if (err) {
    console.log(err.stack);
    process.exit(1);
  }
}
