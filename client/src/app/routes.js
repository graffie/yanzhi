var React = require('react');
var Router = require('react-router');
var {Routes, Route, Link, DefaultRoute, NotFoundRoute} = Router;

var App = require('./components/routes/App')
var Tab = require('./components/routes/Tab')
var Detail = require('./components/routes/Detail')
var Login = require('./components/routes/Login')
var Logout = require('./components/routes/Logout')
var Signup = require('./components/routes/Signup')
var Upload = require('./components/routes/Upload')

var routes = (
  <Route name='app' path='/' handler={App}>
    <DefaultRoute handler={Tab} />
    <Route name='tab' path=':tab' handler={Tab}>
      <Route name='item' path='photo/:id' handler={Detail} />
      <Route name='login' path='login' handler={Login} />
      <Route name='signup' path='signup' handler={Signup} />
      <Route name='logout' path='logout' handler={Logout}/>
      <Route name='upload' path='upload' handler={Upload}/>
    </Route>
  </Route>
);

module.exports = routes;
