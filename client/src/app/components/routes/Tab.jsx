// Their code
import React  from 'react'
import { RouteHandler, Navigation, State } from 'react-router'

// Our code
import PhotoList from '../views/PhotoList'
import User from '../views/User'

export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: photos
    }
  }

  render() {
    var section = <PhotoList photos={this.state.photos}/>

    let { router } = this.context
    let {tab} = router.getCurrentParams()
    if(tab == 'user') {
      section= <User user={user} />
    }

    return (
      <div>
        <div id='main'>{section}</div>
        <RouteHandler />
      </div>
    )
  }
}

Tab.contextTypes = {
  router: React.PropTypes.func
};

Tab.propTypes = {

}

Tab.defaultProps = {

}

var photos = [{
  url: 'http://img.wallba.com/data/Image/2013pq/4yue/3hao/3/6/201343111233890.jpg',
  score: 7.0,
  id: 1
}, {
  url: 'http://img.article.pchome.net/00/59/22/36/pic_lib/wm/Meinv06.jpg',
  score: 7.0,
  id: 2
}, {
  url: 'http://image.hiapk.com/pic/2012/06/and_shoujipic_meinv_20120206_3.jpg',
  score: 7.0,
  id: 3
}, {
  url: 'http://image.hiapk.com/pic/2012/01/18/and_shoujipic_meinv_20120118_9.jpg',
  score: 7.0,
  id: 4
}, {
  url: 'http://www.345654.com/wp-content/uploads/2013/03/meinv-1-693x1024.jpg',
  score: 7.0,
  id: 5
}, {
  url: 'http://www.it.com.cn/games/image/news/2011/01/27/14/meinv012703.jpg',
  score: 7.0,
  id: 6
}, {
  url: 'http://image.hiapk.com/pic/2012/01/18/and_shoujipic_meinv_20120118_2.jpg',
  score: 7.0,
  id: 7
}, {
  url: 'http://image2.wangchao.net.cn/pic/1331420746238.jpg',
  score: 7.0,
  id: 8
}, {
  url: 'http://cmsserver.guopu.cc/UpFile/2014/1/4/2014010410322566.jpg',
  score: 7.0,
  id: 9
}, {
  url: 'http://www.it.com.cn/games/image/news/2011/01/27/14/meinv012708.jpg',
  score: 7.0,
  id: 10
}]

var user = {
  name:'xeodou',
  avatar: 'https://avatars1.githubusercontent.com/u/914595?v=3',
  photos: photos
}
