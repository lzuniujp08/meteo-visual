var iconImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEKElEQVR4Xu2aTWgdVRiG33duzM9MClqhdeEPrUgk1BTUaEGlouBOUDEois1NaTdSS5eCLYWKuBIXtQhRc+cm2EqzqIviyoWKghRX1hIVoT+0gnGhYs7kJtyZT+b+j7dJ7jDDnGlnsknunG++9z3P+c6cM+eGyPgPM95/5ADyCsg4gXwKZLwA8odgPgXyKZAiAjKBIViDj3ZZEu9PllcvNK/LVP8oxNjSFddfOcdpOGG6lKopIHsHRiB9P3cDkM9pO8+3AZjzAF/simP1fs6s/JJdAFV3O+cqF7MLYNW7i58uX80ugALu4Mfqj+wCWFGbeRJ/ZRfAktrEeSxlF8CwGuRxrGQWAEsq9LIe+oYwdMPGRtoHiKzSdgbCat5MABRtZzjDAPA3bXVblgEs0lZbMwxArtF27swygEu0nW2xApCiuQxyMGzSUPGUcc44P/j3RFsF8CttNRJKG1j/SOwGA3CBttqRBIAFiGxbozJ+AmQE4C0BIyIC0G8bBVkItHVWQJQDEcNYalZSGAjr7gMCFSDiwsAuX0QmMAzL+gLEE3UxcVCtPsy51QUp4lbQ/ArgznqT/3LiPki7cklewxb0mecA3tMyKfIRgN/DmO45to8fbvR22DsA4GuW1JNNcZm09sBAuQHgDEvOC6224tAh0Hi/DkA+oe3sa7eZx0Ae6bkTUQJd7OSs+nG9FL0DELkC5WznPNxav6bMtwEebozyedpqrKOTJ0C+3mj7hrba3W6zToF4OUq/er43VgD13pyFJ3MwOAbBIZBWh5nT8LzTMIxdEDkIsr/dJiWInAXoV9ABkMlsweMH0DP7dATmAKI+AybNt0AEl7R0jG1vLqKuAr2p3NhRlKL1HoiHtHVDIAA8EB5EvNrfzc/+b+n8TL/NbV9rxDdjWnka94D1vLU8XiNvLUc9r/A3BtdzbRg0CMsKpDpOeQMD+Ne6BuJ2DS70SYr7Ku3Kydp6LMWhd0HjTX1uElYWOU7bOeir1gHsGbobBV4EaCRsJWY5v6wxC+ApkPdeN7nI91DO480dbWtHJkXzDMjnYnaUYDq5jKrzCOewKBMowLIWQNwXMCBYhKse8GOa19sAJgefhlH4MkHHMUvJMZaco+13DnMa5P6WiP82K7Kb5eXvOoUDe3KZsvx/QhiN2VlS6U6xpF7pAPAtyMda4p4cYNk58X8zQQBFcz/I6aQcx6pTO3TBB4D4ZxHPgix25A/AWbsC/CVxyfIPJzbHak5nMsF5bFLja31n2PVaepMtif/A9cY4u3xlrTHoBrDP2gpXrgLs0zlwkbX9KWF4z3Cmsu6D/boHEzJlfQbgpcgmdCbw5DDLzjsbWUjmZGYjFxrbcwAa4adCOq+AVAyDRhN5BWiEnwrpvAJSMQwaTeQVoBF+KqTzCkjFMGg0kVeARvipkP4PJK4+uGutwBsAAAAASUVORK5CYII=';
var _map;
function getMapCoord(lon, lat, proj) {
  return !proj || proj==='EPSG:3857' ? ol.proj.fromLonLat([lon, lat]) : [lon, lat];
}

function locusOption(data) {
  this.locusData = {
    locusId: null,
    label: null,
    icon: iconImg,
    lnglat: [],
    lineType: "solid",
    lineWidth: 3,
    nodeIcon: null,
    lineOpacity: 0.6,
    lineColor: "#0000ff",
    enableRotation: true
  };

  this.locusState = {
    moveSpeed: 100,
    isSetView: true,
    syncEvent: null,
    circlable: false,
    overlayEvent: null
  };

  if (data) {
    if (data.locusData) {
      if (data.locusData.locusId) this.locusData.locusId = data.locusData.locusId;
      if (data.locusData.icon) this.locusData.icon = data.locusData.icon;
      if (data.locusData.label) this.locusData.label = data.locusData.label;
      if (data.locusData.lnglat) this.locusData.lnglat = data.locusData.lnglat;
      if (data.locusData.lineType) this.locusData.lineType = data.locusData.lineType;
      if (data.locusData.nodeIcon) this.locusData.nodeIcon = data.locusData.nodeIcon;
      if (data.locusData.lineWidth) this.locusData.lineWidth = data.locusData.lineWidth;
      if (data.locusData.lineColor) this.locusData.lineColor = data.locusData.locusData.lineColor;
      if (data.locusState) {
        if (data.locusState.moveSpeed) this.locusState.moveSpeed = data.locusState.moveSpeed;
        if (data.locusState.isSetView != undefined) this.locusState.isSetView = data.locusState.isSetView;
        if (data.locusState.syncEvent) this.locusState.syncEvent = data.locusState.syncEvent;
        if (data.locusState.circlable != undefined) this.locusState.circlable = data.locusState.circlable;
        if (data.locusState.overlayEvent) this.locusState.overlayEvent = data.locusState.overlayEvent;
      }
    }
  }
}

function initLocus(map, coordinates) {
  _map = map;
  var lineArr = [];
  for(var i = 0;i<coordinates.length;i++) {
    var coord = coordinates[i];
    lineArr.push(new getMapCoord(coord[0], coord[1]));
  }
  var option = new locusOption({
    locusData: {
      lnglat: lineArr,
      enableRotation: false
    }
  });
  return moveLocus(option);
}

var moveLocus = function(LocusOption) {
  var locus;
  try {
    var _locusState = LocusOption.locusState;
    var _locusData = LocusOption.locusData;
    fitView2Data(_locusData, _locusState);
    //开启路书
    locus = new TYMapLib.lu_track(_map, _locusData.lnglat, {
      defaultContent: _locusData.label,
      autoView: _locusState.isSetView,
      speed: _locusState.moveSpeed,
      enableRotation: _locusData.enableRotation,
      circlable: _locusState.circlable
    });
    return locus;
  } catch (e) {
    console.log(e.message);
  }
};

/**
 * 适应路径区域
 * @param locusData
 */
function fitView2Data(locusData) {
  if (locusData) {
    if (locusData.nodeIcon) image = locusData.nodeIcon;
    if (locusData.label) text = locusData.label.content;
    if (locusData.label) offset = locusData.label.offset;
  }
  var arrLngLat = locusData.lnglat;
  var arrX = [], arrY = [];
  for (var i in arrLngLat) {
    arrX.push(arrLngLat[i][0]);
    arrY.push(arrLngLat[i][1]);
  }
  //视野
  setFitView(arrX, arrY);
  function setFitView(__boxX, __boxY) {
    try {
      var sort1 = [__boxX.sort()[0], __boxX.sort()[__boxX.sort().length - 1]];
      var sort2 = [__boxY.sort()[0], __boxY.sort()[__boxY.sort().length - 1]];
      _map.getView().fit([sort1[0], sort2[0], sort1[1], sort2[1]], _map.getSize());
    } catch (e) {
      console.log(e.message);
    }
  }
}

function TYCar(lnglat, config) {
  var mp = document.createElement("div");
  mp.id = "mymovecar";
  mp.style.position = "absolute";

  var mimg = document.createElement("img");
  mimg.height = '30';
  mimg.width = '40';
  if (config.icon) mimg.src = config.icon;
  mp.appendChild(mimg);

  var TYMarker = new ol.Overlay({
    id: "_ty_lj_key_car",
    stopEvent: false,
    offset: [-26, -13],
    positioning: "center-center",
    element: mp
  });
  TYMarker.setPosition(lnglat);
  TYMarker.setRotation = function(a) {
    if (!isNaN(a)) {
      if (a <= 360 && a >= 0) {
        var x = document.getElementById("mymovecar");
        x.style.transform = "rotate(" + a + "deg)";
      }
    }
  };
  return TYMarker;
}

var TYMapLib = window.TYMapLib = TYMapLib || {};
(function() {
  /**
   * @exports lu_track as TYMapLib.lu_track
   */
  var lu_track =
    TYMapLib.lu_track = function(map, path, opts) {
      if (!path || path.length < 1) {
        return;
      }
      this._map = map;
      this._path = path;
      this.i = 0;
      this._setTimeoutQuene = [];
      this._opts = {
        icon: null,
        speed: 400,
        defaultContent: ''
      };
      this._setOptions(opts);
      if (!this._opts.icon) {
        this._opts.icon = iconImg;
      }
    };
  /**
   * 根据用户输入的opts，修改默认参数_opts
   * @param {Json Object} opts 用户输入的修改参数.
   * @return 无返回值.
   */
  lu_track.prototype._setOptions = function(opts) {
    if (!opts) {
      return;
    }
    for (var p in opts) {
      if (opts.hasOwnProperty(p)) {
        this._opts[p] = opts[p];
      }
    }
  };

  lu_track.prototype.start = function() {
    var me = this, len = me._path.length;
    if (me.i && me.i < len - 1) {
      if (!me._fromPause) {
        return;
      } else if (!me._fromStop) {
        me._moveNext(++me.i);
      }
    } else {
      me._addMarker();
      me._timeoutFlag = setTimeout(function() {
        me._moveNext(me.i);
      }, 400);
    }
    //重置状态
    this._fromPause = false;
    this._fromStop = false;
  },
    lu_track.prototype.stop = function() {
      this.i = 0;
      this._fromStop = true;
      clearInterval(this._intervalFlag);
      this._clearTimeout();
    };
  lu_track.prototype.pause = function() {
    clearInterval(this._intervalFlag);
    //标识是否是按过pause按钮
    this._fromPause = true;
    this._clearTimeout();
  };
  /**
   * 添加marker到地图上
   * @param {Function} 回调函数.
   * @return 无返回值.
   */
  lu_track.prototype._addMarker = function(callback) {
    if (this._marker) {
      this.stop();
      _map.removeOverlay(this._marker);
      clearTimeout(this._timeoutFlag);
    }
    //移除之前的overlay
    this._overlay && _map.removeOverlay(this._overlay);;
    var marker = new TYCar(this._path[0], this._opts);
    _map.addOverlay(marker);
    this._marker = marker;
  },
    /**
     * 计算两点间的距离
     * @param {Point} poi 经纬度坐标A点.
     * @param {Point} poi 经纬度坐标B点.
     * @return 无返回值.
     */
    lu_track.prototype._getDistance = function(pxA, pxB) {
      var coordinates = [pxA, pxB];
      var wgs84Sphere = new ol.Sphere(6378137), length = 0;
      var sourceProj = _map.getView().getProjection();
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += wgs84Sphere.haversineDistance(c1, c2);
      }
      return length;
    },
    lu_track.prototype._move = function(initPos, targetPos, effect, currentCount) {
      var me = this;
      me.ismove = true;
      //当前的帧数
      if (!currentCount)
        currentCount = 0;
      //步长，米/秒
      var timer = 10,
        step = this._opts.speed / (1000 / timer),
        //初始坐标
        init_pos = this._map.getPixelFromCoordinate(initPos),
        //获取结束点的(x,y)坐标
        target_pos = this._map.getPixelFromCoordinate(targetPos),
        //总的步长
        count = Math.round(me._getDistance(init_pos, target_pos) / step);
      //如果小于1直接移动到下一点
      if (count < 1) {
        me._moveNext(++me.i);
        return;
      }
      //两点之间匀速移动 setInterval
      me._intervalFlag = setInterval(function() {
        //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
        if (currentCount >= count) {
          clearInterval(me._intervalFlag);
          //移动的点已经超过总的长度
          if (me.i > me._path.length) {
            return;
          }
          //运行下一个点
          me._moveNext(++me.i);
        } else {
          currentCount++;
          me._cc = currentCount;
          var x = effect(init_pos[0], target_pos[0], currentCount, count),
            y = effect(init_pos[1], target_pos[1], currentCount, count),
            pos = me._map.getCoordinateFromPixel([x, y]);
          //设置marker
          if (currentCount == 1) {
            var proPos = null;
            if (me.i - 1 >= 0) {
              proPos = me._path[me.i - 1];
            }
            if (me._opts.enableRotation == true) {
              me.setRotation(proPos, initPos, targetPos);
            }
            if (me._opts.autoView) {

            }
          }
          var extent = _map.getView().calculateExtent(_map.getSize());
          var bl = ol.extent.getBottomLeft(extent);
          var tr = ol.extent.getTopRight(extent);
          var bb = ol.extent.containsCoordinate([bl[0], bl[1], tr[0], tr[1]], pos);
          if (!bb) {
            if (me._opts.autoView) {
              clearInterval(me._intervalFlag);
              _map.getView().setCenter(pos);
              me._move(initPos, targetPos, me._tween.linear);
            } else {
              me._marker.setPosition(pos);
            }
          } else {
            me._marker.setPosition(pos);
          }
        }
      }, timer);
    },

    /**
     *在每个点的真实步骤中设置小车转动的角度
     */
    lu_track.prototype.setRotation = function(prePos, curPos, targetPos) {
      var me = this;
      curPos = me._map.getPixelFromCoordinate(curPos);
      targetPos = me._map.getPixelFromCoordinate(targetPos);
      curPos = { x: curPos[0], y: curPos[1] };
      targetPos = { x: targetPos[0], y: targetPos[1] }
      var x = Math.abs(targetPos.x - curPos.x);
      var y = Math.abs(targetPos.y - curPos.y);
      var z = Math.sqrt(x * x + y * y);
      var ration = Math.round((Math.asin(y / z) / Math.PI * 180));
      var a = 0;
      if (targetPos.y < curPos.y && targetPos.x == curPos.x) {
        a = 270; // (180 - ration);
      }
      else if (targetPos.y > curPos.y && targetPos.x == curPos.x)
        a = 90;///ration;
      else if (targetPos.y == curPos.y && targetPos.x < curPos.x)
        a = 180;//(180 - ration);
      else if (targetPos.y == curPos.y && targetPos.x > curPos.x)
        a = 0;//ration;
      else if (targetPos.y > curPos.y && targetPos.x > curPos.x)
        a = ration;
      else if (targetPos.y > curPos.y && targetPos.x < curPos.x)
        a = 180 - ration;
      else if (targetPos.y < curPos.y && targetPos.x < curPos.x)
        a = 180 + ration;
      else if (targetPos.y < curPos.y && targetPos.x > curPos.x)
        a = 360 - ration;
      this._marker.setRotation(a);
    },

    /**
     * 移动到下一个点
     * @param {Number} index 当前点的索引.
     * @return 无返回值.
     */
    lu_track.prototype._moveNext = function(index) {
      var me = this;
      if (index == me._path.length - 1 && me._opts.circlable) {
        index = 0;
        me.i = 0;
      }
      if (index < this._path.length - 1) {
        //判断是否需要屏幕暂停，移动中心
        var ifXYZ1 = me._path[index];
        var ifXYZ2 = me._path[index + 1];

        var extent = _map.getView().calculateExtent(_map.getSize());

        var bl = ol.extent.getBottomLeft(extent);
        var tr = ol.extent.getTopRight(extent);

        tr = [_map.getPixelFromCoordinate(tr)[0] - 30, _map.getPixelFromCoordinate(tr)[1] + 30];
        bl = [_map.getPixelFromCoordinate(bl)[0] + 30, _map.getPixelFromCoordinate(tr)[1] - 30];

        tr = _map.getCoordinateFromPixel(tr);
        bl = _map.getCoordinateFromPixel(bl);

        var extentA = ol.extent.containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ1);
        var extentB = ol.extent.containsCoordinate([bl[0], bl[1], tr[0], tr[1]], ifXYZ2);

        if (extentA == false || extentB == false) {
          if (me._opts.autoView) {
            clearInterval(locus._intervalFlag);

            var centerA = (ifXYZ2[0] - ifXYZ1[0]) / 2 + ifXYZ2[0];
            var centerB = (ifXYZ2[1] - ifXYZ1[1]) / 2 + ifXYZ2[1];

            if (extentA == false && extentB == false) {
              _map.getView().setCenter([centerA, centerB]);
            }
            else if (extentA == false) {
              _map.getView().setCenter(ifXYZ1);
            }
            else if (extentB == false) {
              _map.getView().setCenter(ifXYZ2);
            } else {
              console.log("#1005853");
              return;
            }
            setTimeout(function() {
              me._move(me._path[index], me._path[index + 1], me._tween.linear);
            }, 100);
          } else {
            me._move(me._path[index], me._path[index + 1], me._tween.linear);
          }
        } else {
          me._move(me._path[index], me._path[index + 1], me._tween.linear);
        }
      }
    },
    //清除暂停后再开始运行的timeout
    lu_track.prototype._clearTimeout = function() {
      for (var i in this._setTimeoutQuene) {
        clearTimeout(this._setTimeoutQuene[i]);
      }
      this._setTimeoutQuene.length = 0;
    },
    //缓动效果
    lu_track.prototype._tween = {
      //初始坐标，目标坐标，当前的步长，总的步长
      linear: function(initPos, targetPos, currentCount, count) {
        var b = initPos, c = targetPos - initPos, t = currentCount,
          d = count;
        return c * t / d + b;
      }
    }
})();
