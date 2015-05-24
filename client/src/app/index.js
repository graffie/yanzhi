var React = window.React = require('react');
var Router = require('react-router');
var routes = require('./routes');
var wechat = require('./utils/wechat')

new wechat().config()

Router.run(routes, function (Handler, state) {
  React.render(<Handler {...state}/>, document.getElementById('app'));
});
