/**
 * 获取线的样式
 * @param feature
 * @param res
 * @returns {*[]}
 */
function getLineStyle(feature, res) {
  //轨迹线图形
  const trackLine= feature.getGeometry();
  let styles = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#2E8B57',
        width: 6
      })
    })
  ];
  //对segments建立btree索引
  const tree= rbush();//路段数
  trackLine.forEachSegment(function(start, end) {
    var dx = end[0] - start[0];
    var dy = end[1] - start[1];
    //计算每个segment的方向，即箭头旋转方向
    let rotation = Math.atan2(dy, dx);
    let geom=new ol.geom.LineString([start,end]);
    let extent=geom.getExtent();
    const item = {
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

  const coords = trackLine.getCoordinates();
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



export { getLineStyle };
