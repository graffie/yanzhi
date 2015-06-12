var React = window.React = require('react');
var Router = require('react-router');
var routes = require('./routes');
var guide = require('./utils/guide');

guide.add(guide.Step('back', '点击可以退到到图片墙', true))
guide.add(guide.Step('photo', '点击上传自拍照', true))
// wechat api sucks.
// var wechat = require('./utils/wechat')
// new wechat().config()

Router.run(routes, function (Handler, state) {
  React.render(<Handler {...state}/>, document.getElementById('app'));
});
