/*!
 * yanzhi - middlewares/transform.js
 */

'use strict';

/**
 * Module dependencies.
 */
var isJSON = require('koa-is-json');
var trans = require('var-style');

var snakeToCamel = trans.snakeToCamel;
var camelToSnake = trans.camelToSnake;

module.exports = function () {
  return function* transform(next) {
    this.query = snakeToCamel(this.query);

    this.params = this.params
      ? snakeToCamel(this.params)
      : this.params;

    this.request.body = this.request.body
      ? snakeToCamel(this.request.body)
      : this.params;

    yield next;
    if (isJSON(this.body)) {
      this.body = camelToSnake(this.body);
    }
  }
};
