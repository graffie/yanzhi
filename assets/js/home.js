;$(function () {
  var map = new BMap.Map('map', {
    enableHighResolution: true,
    enableMapClick: false,
  });
  var geo = new BMap.Geocoder();
  map.disableDoubleClickZoom();
  map.disableDragging();
  map.disablePinchToZoom();
  map.addEventListener('dragend', function (evt) {
    var bounds = map.getBounds();
    fetchFeedsByBounds(bounds);
  });
  var defaultPoint = new BMap.Point(120.030007, 30.286301);
  map.centerAndZoom(defaultPoint, 18);

  var curPosition = {};
  var curFeeds = {};
  var curFeedsPos = {};

  function renderFeeds(feeds) {
    for (var i = 0; i < feeds.length; i++) {
      var feed = feeds[i];
      if (curFeeds[feed.id]) {
        continue;
      }
      var opts = {
        position: new BMap.Point(feed.lng, feed.lat)
      };
      // 检查有没有重叠
      var posKey = [feed.lng, feed.lat].join(',');
      curFeedsPos[posKey] = curFeedsPos[posKey] || 0;
      if (curFeedsPos[posKey]) {
        var offsetX = 5 * curFeedsPos[posKey];
        var offsetY = -(17 * curFeedsPos[posKey]);
        opts.offset = new BMap.Size(offsetX, offsetY);
      }
      var label = new BMap.Label(feed.content, opts);
      map.addOverlay(label);
      curFeeds[feed.id] = feed;
      curFeedsPos[posKey] += 1;
    }
  }

  function fetchFeedsByBounds(bounds) {
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    fetchFeeds(southWest, northEast);
  }

  function fetchFeeds(southWest, northEast) {
    $.ajax('/api/feed', {
      type: 'GET',
      timeout: 10 * 1000,
      dataType: 'json',
      cache: false,
      data: {
        lngmin: southWest.lng,
        lngmax: northEast.lng,
        latmin: southWest.lat,
        latmax: northEast.lat
      },
      success: function (data, textStatus, jqXHR) {
        if (textStatus !== 'success' || !data) {
          alert('出错了，请稍候再试。');
          return false;
        }
        renderFeeds(data);
        return false;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert('出错了，请稍候再试。');
        return false;
      }
    });
  }

  // 获取用户当前位置
  function handleFailed(code) {
    switch (code) {
      case BMAP_STATUS_UNKNOWN_LOCATION:
        alert('请求位置失败：位置结果未知。');
        break;
      case BMAP_STATUS_UNKNOWN_ROUTE:
        alert('请求位置失败：导航结果未知。');
        break;
      case BMAP_STATUS_INVALID_KEY:
        alert('请求位置失败：非法密钥。');
        break;
      case BMAP_STATUS_INVALID_REQUEST:
        alert('请求位置失败：非法请求。');
        break;
      case BMAP_STATUS_PERMISSION_DENIED:
        alert('请求位置失败：没有权限。');
        break;
      case BMAP_STATUS_SERVICE_UNAVAILABLE:
        alert('请求位置失败：服务不可用。');
        break;
      case BMAP_STATUS_TIMEOUT:
        alert('请求位置失败：超时。');
        break;
    }
  }
  function getPositionSucceed(lng, lat) {
    // Set map.
    var point = new BMap.Point(lng, lat);
    map.panTo(point);

    // Storage position.
    curPosition['lng'] = lng;
    curPosition['lat'] = lat;

    fetchFeedsByBounds(map.getBounds());
    setInterval(function () {
      fetchFeedsByBounds(map.getBounds());
    }, 10 * 1000);
  }
  var geolocation = new BMap.Geolocation();
  geolocation.getCurrentPosition(function (res) {
    if (this.getStatus() !== BMAP_STATUS_SUCCESS) {
      return handleFailed(this.getStatus());
    }
    var lng = res.point.lng;
    var lat = res.point.lat;
    getPositionSucceed(lng, lat);
  }, {enableHighAccuracy: true, maximumAge: 1000});

  // Post
  var postNode = $('#post');
  var postBtnNode = $('#post-btn');
  var postFormNode = postNode.find('#post-form');
  var postInputNode = postFormNode.find('#post-input');
  var postUserNode = postFormNode.find('#post-user');
  var postCommitNode = postNode.find('#post-send-btn');
  var postCloseBtnNode = postNode.find('#post-close-btn');
  postUserNode.val(localStorage['userNick'] || '');
  postBtnNode.on('touchend', function () {
    $(window).scrollTop(0);
    postInputNode.focus();
  });
  postCloseBtnNode.on('touchend', function () {
    postInputNode.val('').blur();
    postUserNode.blur();
    postNode.removeClass('active');
    fetchFeedsByBounds(map.getBounds());
  });
  postCommitNode.on('touchend', function (evt) {
    evt.preventDefault();
    if (postCommitNode.prop('disabled')) {
      return false;
    }

    if (typeof curPosition.lng !== 'number' ||
        typeof curPosition.lat !== 'number') {
      alert('获取位置失败，不能发布内容，抱歉。');
      return false;
    }

    var content = postInputNode.val().trim();
    if (!content) {
      alert('请写点内容');
      return false;
    }
    var user = postUserNode.val().trim();
    postCommitNode.prop('disabled', true).addClass('icon-more');
    var postData = {
      content: content,
      lng: curPosition.lng,
      lat: curPosition.lat
    };
    if (user) {
      postData['user_nick'] = user;
    }
    localStorage.setItem('userNick', user);
    $.ajax('/api/feed', {
      type: 'POST',
      timeout: 10 * 1000,
      dataType: 'json',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(postData),
      success: function (data, textStatus, jqXHR) {
        if (textStatus !== 'success' || !data) {
          alert('出错了，请稍候再试。');
          postCommitNode.removeClass('icon-more').prop('disabled', false);
          return false;
        }
        postCommitNode.removeClass('icon-more').prop('disabled', false);
        postCloseBtnNode.trigger('touchend');
        return false;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert('出错了，请稍候再试。');
        postCommitNode.removeClass('icon-more').prop('disabled', false);
        return false;
      }
    });
    return false;
  });
});
