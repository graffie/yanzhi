var React = window.React = require('react');
var Router = require('react-router');
var routes = require('./routes');

Router.run(routes, function (Handler, state) {
  React.render(<Handler {...state}/>, document.body);
});
