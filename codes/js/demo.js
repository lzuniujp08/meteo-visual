var colorMap = [
  {
    color: '77,119,176,255',
    lable: '0~5'
  },
  {
    color: '78,153,164,255',
    lable: '5~10'
  },
  {
    color: '77,164, 87,255',
    lable: '10~20'
  },
  {
    color: '175,170,75,255',
    lable: '20~30'
  }
];
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

function addLegend() {
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
    })
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
