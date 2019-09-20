var colorMap = [
  {
    color: '77,119,176,255',
    lable: '0~2'
  },
  {
    color: '78,153,164,255',
    lable: '2~4'
  },
  {
    color: '77,164, 87,255',
    lable: '4~8'
  },
  {
    color: '175,170,75,255',
    lable: '8~10'
  }
];

var colorDict = [{"id":"c3bbf88a14404a3ebae7c9ebfbf44ce5","legendCode":"hspt_tem","color":"0,0,153,255","lable":"<=-30","sortBy":0,"projectCode":null},{"id":"401bf219940d41f99fd0f3780a4745e5","legendCode":"hspt_tem","color":"0,0,255,255","lable":"-30~-25","sortBy":1,"projectCode":null},{"id":"b7a369cfa95e4c5796c83ead1688c369","legendCode":"hspt_tem","color":"0,102,255,255","lable":"-25~-20","sortBy":2,"projectCode":null},{"id":"9fe46a8b7e514ed4bdfd7e987b6f9150","legendCode":"hspt_tem","color":"51,153,255,255","lable":"-20~-15","sortBy":3,"projectCode":null},{"id":"fba0258a8375432ba3367418a29aceb2","legendCode":"hspt_tem","color":"0,204,255,255","lable":"-15~-10","sortBy":4,"projectCode":null},{"id":"8423c8fbbab041629cc127450093789f","legendCode":"hspt_tem","color":"0,255,255,255","lable":"-10~-5","sortBy":5,"projectCode":null},{"id":"88d1883ee0a34d97b5e4fc8c4adff3e9","legendCode":"hspt_tem","color":"153,255,255,255","lable":"-5~0","sortBy":6,"projectCode":null},{"id":"4566bdf704b14f3a8ead6ea231667d42","legendCode":"hspt_tem","color":"0,255,0,255","lable":"0~5","sortBy":7,"projectCode":null},{"id":"e4fedaa99f7a47f3adf6b816a16f37a4","legendCode":"hspt_tem","color":"153,255,102,255","lable":"5~10","sortBy":8,"projectCode":null},{"id":"dd5f77e1b620471d82699437b906c763","legendCode":"hspt_tem","color":"204,255,51,255","lable":"10~15","sortBy":9,"projectCode":null},{"id":"56a6878003ab4dfe88261c879bd196f2","legendCode":"hspt_tem","color":"255,255,0,255","lable":"15~20","sortBy":10,"projectCode":null},{"id":"1cc01a6276494936b8c076df5a68a02b","legendCode":"hspt_tem","color":"255,204,0,255","lable":"20~25","sortBy":11,"projectCode":null},{"id":"38cc1002b645443aa7d546050c156f4c","legendCode":"hspt_tem","color":"255,153,0,255","lable":"25~30","sortBy":12,"projectCode":null},{"id":"fb5ede56006e49b384c68897a1be871f","legendCode":"hspt_tem","color":"255,102,0,255","lable":"30~35","sortBy":13,"projectCode":null},{"id":"726f0b7ec0a64973849b4f28bc130041","legendCode":"hspt_tem","color":"255,0,0,255","lable":"35~37","sortBy":14,"projectCode":null},{"id":"02d4e94bd51b4782953f3b63717c36fb","legendCode":"hspt_tem","color":"183,0,0,255","lable":"37~39","sortBy":15,"projectCode":null},{"id":"b4793224e7174866a71572bbe2fb915a","legendCode":"hspt_tem","color":"255,0,153,255","lable":"39~41","sortBy":16,"projectCode":null},{"id":"4afedc05077849b3bf6daaa6254c8e19","legendCode":"hspt_tem","color":"204,0,255,255","lable":"41~43","sortBy":17,"projectCode":null},{"id":"ab0c78ae293a47baa94b61a078db18c8","legendCode":"hspt_tem","color":"153,0,204,255","lable":"43~45","sortBy":18,"projectCode":null},{"id":"5725a95411414b2985176f74af4f236a","legendCode":"hspt_tem","color":"102,0,102,255","lable":">=45","sortBy":19,"projectCode":null}];
function getTemColor(val) {
  for(var i = 0;i<colorDict.length;i++) {
    var c = colorDict[i];
    if(c.lable.indexOf('~')!==-1) {
      var vals = c.lable.split('~').map(Number);
      var min = vals[0],
        max = vals[1];
      if(val >= min && val <= max) {
        return c.color.split(",");
      }
    }
    else if(c.lable.indexOf('>')!==-1) {
      var min = Number(c.lable.replace(/[^0-9]/ig,""));
      if(val >= min) {
        return c.color.split(",");
      }
    }
    else {
      var max = Number(c.lable.replace(/[^0-9]/ig,""));
      if(c.lable.indexOf('-') !== -1) max = -max;
      if(val <= max) {
        return c.color.split(",");
      }
    }
  }
}

function getColor(ws) {
  for(var i = 0;i<colorMap.length;i++) {
    var color = colorMap[i];
    var lable = color.lable.split("~");
    var range = [Number(lable[0]), Number(lable[1])];
    if(ws >=range[0] && ws<range[1]) {
      return color.color.split(",");
    }
  }
}

function addLegend(colorMap) {
  var legendDom = document.createElement("div");
  legendDom.setAttribute('id', 'legend');
  document.body.appendChild(legendDom);

  for(var i = 0;i<colorMap.length;i++) {
    var color = colorMap[i];
    var li = document.createElement("li");
    var span = document.createElement("span");
    var lable = document.createElement("label");
    span.style.backgroundColor = 'RGBA(' + color.color +")";
    lable.innerText = color.lable;
    li.appendChild(span);
    li.append(lable);
    legendDom.appendChild(li);
  }
}

function addGradientLegend() {
  var canvas = document.createElement("canvas");
  canvas.setAttribute("width", 80);
  canvas.setAttribute("height", 300);
  var context = canvas.getContext("2d");
  var percent =  100 / colorMap.length / 100;
  var hInterval = canvas.height / colorMap.length;
  var linearGradient = context.createLinearGradient(0,0,15,canvas.height);
  context.font = '12px Arial';
  for(var i = 0;i<colorMap.length;i++) {
    var color = colorMap[i];
    linearGradient.addColorStop(percent * i, 'RGBA(' + color.color +")");
    var y = (hInterval-6) * i + 12;
    context.fillText(color.lable.split("~")[0], 18, y);
  }
  context.fillStyle = linearGradient;
  context.fillRect(0,0,15,canvas.height);
  var legendDom = document.createElement("div");
  legendDom.setAttribute('id', 'legend');
  document.body.appendChild(legendDom);
  legendDom.appendChild(canvas);
}

function getTilelayer(lyr){
  var url = "http://10.30.17.52:19999/maps//terrain/{z}/{x}/{y}.png";
  var layer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:url
    })
  });
  return layer;
}

function getTileSea() {
  var source = new ol.source.OSM({
    url: 'http://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}',
    attributions: [],
    crossOrigin: null,
    maxZoom: 15
  });
  var layer = new ol.layer.Tile({
    source: source
  });
  return layer;
}

/*function getTileSea(){
  // var url = "http://m12.shipxy.com/tile.c?l=Na&m=o&x={x}&y={y}&z={z}";
  var url = 'http://gis.chinaports.com:5010/map/getMap/{x}/{y}/{z}';
  var layer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url:url
    })
  });
  return layer;
}*/

function getWmsLayer() {
  var wms = new ol.layer.Image({
    source: new ol.source.ImageWMS({
      ratio: 1,
      url: 'http://39.106.122.204:8086/geoserver/world/wms',
      params: {
        'VERSION': '1.1.1',
        STYLES: '',
        LAYERS: 'world:base_province',
      }
    }),
    zIndex: 2
  });
  return wms;
}

//数据池
var store = function(smap) {
  var _ = {
    data : [],
    spatialmap : smap
  };
  this.max = 1;
  this.unit = "",
    this.get = function(key){
      return _[key];
    };
  this.set = function(key, value){
    _[key] = value;
  };
};
store.prototype = {
  setDataSet : function(data) {
    var me = this;
    spatialmap = me.get("spatialmap");
    spatialmap.colorize(data);
    this.max = data.max;
    this.unit = data.unit;
  }
};
var SpatialMap = function (config) {
  var _ = {
    element: {},
    canvas: {},
    ctx: {},
    width: 0,
    height: 0,
    startColor: {},
    endColor: {},
    gradient: {},
    palette: {},
    alpha: 1
  };
  this.store = new store(this);
  this.get = function (key) {
    return _[key];
  };
  this.set = function (key, value) {
    _[key] = value;
  };
  this.configure(config);
  this.init();
};
SpatialMap.prototype = {
  configure: function (config) {
    var me = this;
    me.set("element", (config.element instanceof Object) ? config.element : document.getElementById(config.element));
    me.set("width", config.width || 0);
    me.set("height", config.height || 0);
    me.set("alpha", config.alpha || 1);
    me.set("gradient", config.gradient || {
      0: "rgb(0,0,255)",
      0.20: "rgb(0,20,255)",
      0.40: "rgb(0,255,255)",
      0.60: "rgb(0,255,0)",
      0.80: "yellow",
      1.0: "rgb(255,0,0)"
    });    // default is the common blue to red gradient
  },
  init: function (config) {
    var me = this;
    var element = me.get("element");
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    me.initPalette();
    me.set("canvas", canvas);
    me.set("ctx", ctx);
    element.appendChild(canvas);
  },
  initPalette: function () {
    var me = this;
    var canvas = document.createElement("canvas");
    var gradient = me.get("gradient");
    canvas.width = "1";
    canvas.height = "256";
    ctx = canvas.getContext("2d");
    grad = ctx.createLinearGradient(0, 0, 1, 256);
    for (var x in gradient) {
      grad.addColorStop(x, gradient[x]);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1, 256);
    me.set("palette", ctx.getImageData(0, 0, 1, 256).data);
  },
  colorize: function (data) {
    //IDW插值算法进行着色
    var me = this;
    var ctx = me.get("ctx");
    var width = me.get("width"), height = me.get("height");
    var image = ctx.createImageData(width, height);
    var imageColored = me.interpolate(data, image, me.get("startColor"), me.get("endColor"), width, height);
    ctx.putImageData(imageColored, 0, 0);
  },
  interpolate: function (data, image, startColor, endColor, width, height) {
    var imgData = image.data;
    var d = data.data;
    var dlen = d.length;
    var palette = this.get("palette");
    //得到点值的二维数组
    var matrixData = [];
    for (var i = 0; i < height; i++) {
      matrixData[i] = [];
      for (var j = 0; j < width; j++) {
        matrixData[i][j] = '';
      }
    }
    for (var i = 0; i < dlen; i++) {
      var point = d[i];
      matrixData[point.y][point.x] = point.count;
    }

    /**
     * 插值矩阵数据,时间复杂度O(height*width*len)
     * 当height = 356, width = 673, len = 26时为6229288
     */
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        if (matrixData[i][j] == '') {
          var sum0 = 0, sum1 = 0;
          for (var k = 0; k < dlen; k++) {
            sum0 += d[k].count * 1.0 / ((i - d[k].y) * (i - d[k].y) + (j - d[k].x) * (j - d[k].x));
            sum1 += 1.0 / ((i - d[k].y) * (i - d[k].y) + (j - d[k].x) * (j - d[k].x));
          }
          if (sum1 != 0)
            matrixData[i][j] = sum0 / sum1;
          else
            matrixData[i][j] = 0;
        }
      }
    }

    //计算数据最大值和最小值
    var min = 99999, max = -99999;
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        if (min > matrixData[i][j]) min = matrixData[i][j];
        if (max < matrixData[i][j]) max = matrixData[i][j];
      }
    }
    //更新图片数据
    for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
        var radio = (matrixData[i][j] - min) / (max - min);
        var alpha = this.get("alpha");
        imgData[4 * (i * width + j)] = palette[Math.floor(radio * 255 + 1) * 4 - 4];
        imgData[4 * (i * width + j) + 1] = palette[Math.floor(radio * 255 + 1) * 4 - 3];
        imgData[4 * (i * width + j) + 2] = palette[Math.floor(radio * 255 + 1) * 4 - 2];
        imgData[4 * (i * width + j) + 3] = Math.floor(255 * alpha);
      }
    }
    image.data = imgData;
    return image;
  },
  clear: function () {
    var me = this;
    me.store.set("data", []);
    me.get("ctx").clearRect(0, 0, this.get("width"), this.get("height"));
  },
  resize: function () {
    var me = this,
      element = me.get("element"),
      canvas = me.get("canvas");
    canvas.width = me.get("width") || element.style.width.replace(/px/, "");
    this.set("width", canvas.width);
    canvas.height = me.get("height") || element.style.height.replace(/px/, "");
    this.set("height", canvas.height);
  }
}

function getValueColor(val) {
  var colorDict = [{"color":"153,51,204,255","lable":">=40","legendCode":"pre","sortBy":14,"id":"29cdcaf1725641f5ad9d4e4787352109"},{"color":"255,0,255,255","lable":"25~40","legendCode":"pre","sortBy":13,"id":"092addeb3bc94194b92ff7e72fc69dc9"},{"color":"255,102,255,255","lable":"20~25","legendCode":"pre","sortBy":12,"id":"e6265d895a7342b3a109fed94804ab63"},{"color":"153,0,0,255","lable":"16~20","legendCode":"pre","sortBy":11,"id":"923961445ae0464793916a035c6f5987"},{"color":"204,0,51,255","lable":"13~16","legendCode":"pre","sortBy":10,"id":"f8c88110bb0b4e28989aeb8d18ddc38a"},{"color":"255,51,0,255","lable":"10~13","legendCode":"pre","sortBy":9,"id":"9ba8e7cd79ec4c158cd2e2a4ddcb0da2"},{"color":"255,204,0,255","lable":"7~10","legendCode":"pre","sortBy":8,"id":"463e6e2e83464b63a4f8bbf08e321027"},{"color":"255,255,102,255","lable":"5~7","legendCode":"pre","sortBy":7,"id":"b175c3b2667142b7a547ead11b446736"},{"color":"0,102,255,255","lable":"3~5","legendCode":"pre","sortBy":6,"id":"f3133e5eb1a04e599fe74d52847b9620"},{"color":"102,204,255,255","lable":"2~3","legendCode":"pre","sortBy":5,"id":"85ac9e60c2bc475483f93ab0fe2b77fa"},{"color":"51,153,0,255","lable":"1~2","legendCode":"pre","sortBy":4,"id":"37582a4a7c164146b3fca85e2c486945"},{"color":"51,204,102,255","lable":"0.5~1","legendCode":"pre","sortBy":3,"id":"eb980f5a0eda472d97f0ffa2c8a70067"},{"color":"153,255,153,255","lable":"0.1~0.5","legendCode":"pre","sortBy":2,"id":"013b08a693dc4467878aa7c0a191612e"},{"color":"0,0,0,0.1","lable":"0","legendCode":"pre","sortBy":1,"id":"dcd37b17ded049b69fb2d955c28eaf53"}];
  for(var i = 0;i<colorDict.length;i++) {
    var c = colorDict[i];
    if(c.lable.indexOf('~')!==-1) {
      var vals = c.lable.split('~').map(Number);
      var min = vals[0],
        max = vals[1];
      if(val >= min && val <= max) {
        return 'rgba('+ c.color +')';
      }
    }
    else if(c.lable.indexOf('>')!==-1) {
      var min = Number(c.lable.replace(/[^0-9]/ig,""));
      if(val >= min) {
        return 'rgba('+ c.color +')';
      }
    }
    else {
      var max = Number(c.lable.replace(/[^0-9]/ig,""));
      if(val <= max) {
        return 'rgba('+ c.color +')';
      }
    }
  }
}

function getLineStyle(feature, res) {
  //轨迹线图形
  var trackLine= feature.getGeometry();
  var styles = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#2E8B57',
        width: 6
      })
    })
  ];
  //对segments建立btree索引
  tree= rbush();//路段数
  trackLine.forEachSegment(function(start, end) {
    var dx = end[0] - start[0];
    var dy = end[1] - start[1];
    //计算每个segment的方向，即箭头旋转方向
    let rotation = Math.atan2(dy, dx);
    let geom=new ol.geom.LineString([start,end]);
    let extent=geom.getExtent();
    var item = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
      geom: geom,
      rotation:rotation
    };
    tree.insert(item);
  });
  //轨迹地理长度
  let length=trackLine.getLength();
  //像素间隔步长
  let stpes=30;//像素步长间隔
  //将像素步长转实际地理距离步长
  let geo_steps=stpes*res;
  //箭头总数
  let arrowsNum=parseInt(length/geo_steps);
  for(let i=1;i<arrowsNum;i++){
    let arraw_coor=trackLine.getCoordinateAt(i*1.0/arrowsNum);
    let tol=10;//查询设置的点的容差，测试地图单位是米。如果是4326坐标系单位为度的话，改成0.0001.
    let arraw_coor_buffer=[arraw_coor[0]-tol,arraw_coor[1]-tol,arraw_coor[0]+tol,arraw_coor[1]+tol];
    //进行btree查询
    var treeSearch = tree.search({
      minX: arraw_coor_buffer[0],
      minY: arraw_coor_buffer[1],
      maxX: arraw_coor_buffer[2],
      maxY: arraw_coor_buffer[3]
    });
    let arrow_rotation;
    //只查询一个，那么肯定是它了，直接返回
    if(treeSearch.length==1)
      arrow_rotation=treeSearch[0].rotation;
    else if(treeSearch.length>1){
      let results=treeSearch.filter(function(item){
        let _tol=1;//消除精度误差的容差
        if(item.geom.intersectsExtent([arraw_coor[0]-_tol,arraw_coor[1]-_tol,arraw_coor[0]+_tol,arraw_coor[1]+_tol]))
          return true;
      });
      if(results.length>0)
        arrow_rotation=results[0].rotation;
    }
    styles.push(new ol.style.Style({
      geometry: new ol.geom.Point(arraw_coor),
      image: new ol.style.Icon({
        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAgUlEQVQ4T62S2w2AMAwDLxuwCYwAk8MIsAkbFBUVqeojCYL+Vr7EdoSPTz7qaQJCCEMEi8hpDagASbwm4WJBeoANGIEdUCGaBRekG2KyYkLUFjwQDyAGOgEHMJehWhZU8V11q+esyu7kR6fdgSlubpAFF/8rz+XG/5+ydfuuDd5ALhvJQhFvguZmAAAAAElFTkSuQmCC',
        anchor: [0.5, 0.5],
        rotateWithView: true,
        rotation: -arrow_rotation
      })
    }));
  }

  var coords = trackLine.getCoordinates();
  // 起点
  styles.push(new ol.style.Style({
    geometry: new ol.geom.Point(coords[0]),
    image: new ol.style.Icon({
      anchor: [0.6, 1],
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAflBMVEUAAABMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgFMqgH2+vWp0pbb69T///+Xyn/k8N7G4brR5sj6/PmDwGPx9+/r9Oc7l5IGAAAAHXRSTlMA+eUE8r21hGMgDdqofE8R6cKPdWwaCsycllw9MgVXHtcAAAEASURBVCjPjZLZloIwDIZpBVFGRh2XWdN0A/T9X3BS8Nj1wu8G2u+E5M+heplLf+SMH/tLSa5aBgusXWW2a8DTdKleQ0iT1J/obrLenyK7r+kKBYARBL3X+1CfAbQYlTBAKCDOWWdX/dTrUHOqxmFEtPTtWfNQU2QrpZIEgJzDh9pNZjSVOa1dgkPaW6CS1mm80WkX6o2baFKoh1FKMdDpPVppDZO6uZkQUdPjLV7bN9i7UQMuAGyqiC27a0AjZowrjvmCANc5LQ9sU2W0gf7LdXdYVJrZZ3/AtlWJz4f+qIr8kvJ/Qs4OHH0ugnD8mgsfzq8z58r9Okv8+HUWSUP9A68+JvosDuUiAAAAAElFTkSuQmCC"
    })
  }));
  // 终点
  styles.push(new ol.style.Style({
    geometry: new ol.geom.Point(coords[coords.length - 1]),
    image: new ol.style.Icon({
      anchor: [0.6, 1],
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAilBMVEUAAADsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwPsAwP86Oj4urr//v7wZGT1lpb71NT2qqruQED+9fX++fn97+/zgID5ycn83t6sBxTQAAAAH3RSTlMA5fryDwX4tWMg2qiCfE8YC8K+u5OLdWwD6cycXD0yRxkOowAAAQ5JREFUKM+NkdlygzAMRTFkbZJC0jRJ1+sFY7b8/+9VuMxUxnQmhyd0RhK6JA+TH44iFcdDPieX+xV+We2XkV2c8MdpMdVrcF5uob1QrXJwavSXcHQGGA2ouiRIZ8H4K1WkctCttXcN4jrZbGqSsnGo/YI114KaW3qcktJbCK5ToLLaAGWjS69TrjMq2J6+TJqubob+t8nuTtu6Mn1v0A39O643NFz2VDZWSww8c10M0ztlqg6uAvEUxn6G1c3dqFZLrzdJwDY18DjVlNNm4gMc2jxpX/EflkS8Mv0d64WAh98c3j6Sbuf07X3U52SWL3iyPJln5/UhFuw4UST/sedxxhSCxxnzGcYZZzd5/wFx2yqJ0ukEJgAAAABJRU5ErkJggg=="
    })
  }));

  return styles;
}
