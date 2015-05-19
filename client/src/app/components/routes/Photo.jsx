var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

export default class Photo extends React.Component {
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

Photo.propTypes = {

}

Photo.defaultProps = {

}
