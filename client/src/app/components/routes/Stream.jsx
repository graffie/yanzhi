var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

export default class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [{
        score: 7.0
      }]
    }
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}

Stream.propTypes = {

}

Stream.defaultProps = {

}
