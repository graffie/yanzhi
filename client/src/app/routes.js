var React = require('react');
var Router = require('react-router');
var {Routes, Route, Link, DefaultRoute, NotFoundRoute} = Router;

var App = require('./components/routes/App')
var Explore = require('./components/routes/Explore')
var Photo = require('./components/routes/Photo')

var routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute handler={Explore} >
    <Route name='list' path='photos' handler={Explore}>
      <Route name='item' path='photos/:id' handler={Photo} />
    </Route>
  </Route>
);

module.exports = routes;
