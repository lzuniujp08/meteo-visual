/**
 * @fileoverview GeoUtils���ṩ���ɼ����㷨�����������û��жϵ�����Ρ�
 * Բ�Ρ�������ߡ��������Ĺ�ϵ,���ṩ�������߳��ȺͶ���ε�����Ĺ�ʽ�� 
 * ���������<a href="symbols/BMapLib.GeoUtils.html">GeoUtils</a>��
 * ����Baidu Map API 1.2��
 *
 * @author Baidu Map Api Group 
 * @version 1.2
 */

/** 
 * @namespace BMap������library�������BMapLib�����ռ���
 */
var BMapLib = window.BMapLib = BMapLib || {};
(function() { 
    
    /**
     * ����뾶
     */
    var EARTHRADIUS = 6370996.81; 

    /** 
     * @exports GeoUtils as BMapLib.GeoUtils 
     */
    var GeoUtils =
    /**
     * GeoUtils�࣬��̬�࣬����ʵ��������ʹ��
     * @class GeoUtils���<b>���</b>��
     * �����ṩ�Ķ��Ǿ�̬����������ʵ��������ʹ�á�     
     */
    BMapLib.GeoUtils = function(){
        
    }
    
    /**
     * �жϵ��Ƿ��ھ�����
     * @param {Point} point �����
     * @param {Bounds} bounds ���α߽����
     * @returns {Boolean} ���ھ����ڷ���true,���򷵻�false
     */
    GeoUtils.isPointInRect = function(point, bounds){
        //��������Ƿ���ȷ
        if (!(point instanceof BMap.Point) || 
            !(bounds instanceof BMap.Bounds)) {
            return false;
        }
        var sw = bounds.getSouthWest(); //���Ͻŵ�
        var ne = bounds.getNorthEast(); //�����ŵ�
        return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
    }
    
    /**
     * �жϵ��Ƿ���Բ����
     * @param {Point} point �����
     * @param {Circle} circle Բ�ζ���
     * @returns {Boolean} ����Բ���ڷ���true,���򷵻�false
     */
    GeoUtils.isPointInCircle = function(point, circle){
        //��������Ƿ���ȷ
        if (!(point instanceof BMap.Point) || 
            !(circle instanceof BMap.Circle)) {
            return false;
        }

        //point��Բ�ľ���С��Բ�ΰ뾶�������Բ�ڣ�������Բ��
        var c = circle.getCenter();
        var r = circle.getRadius();

        var dis = GeoUtils.getDistance(point, c);
        if(dis <= r){
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * �жϵ��Ƿ���������
     * @param {Point} point �����
     * @param {Polyline} polyline ���߶���
     * @returns {Boolean} ���������Ϸ���true,���򷵻�false
     */
    GeoUtils.isPointOnPolyline = function(point, polyline){
        //�������
        if(!(point instanceof BMap.Point) ||
            !(polyline instanceof BMap.Polyline)){
            return false;
        }

        //�����жϵ��Ƿ����ߵ���������ڣ�����ڣ����һ���жϣ����򷵻�false
        var lineBounds = polyline.getBounds();
        if(!this.isPointInRect(point, lineBounds)){
            return false;
        }

        //�жϵ��Ƿ����߶��ϣ����ΪQ���߶�ΪP1P2 ��
        //�жϵ�Q�ڸ��߶��ϵ������ǣ�( Q - P1 ) �� ( P2 - P1 ) = 0���� Q ���� P1��P2Ϊ�ԽǶ���ľ�����
        var pts = polyline.getPath();
        for(var i = 0; i < pts.length - 1; i++){
            var curPt = pts[i];
            var nextPt = pts[i + 1];
            //�����ж�point�Ƿ���curPt��nextPt֮�䣬�������жϸõ��Ƿ��ڸ��߶ε����������
            if (point.lng >= Math.min(curPt.lng, nextPt.lng) && point.lng <= Math.max(curPt.lng, nextPt.lng) &&
                point.lat >= Math.min(curPt.lat, nextPt.lat) && point.lat <= Math.max(curPt.lat, nextPt.lat)){
                //�жϵ��Ƿ���ֱ���Ϲ�ʽ
                var precision = (curPt.lng - point.lng) * (nextPt.lat - point.lat) - 
                    (nextPt.lng - point.lng) * (curPt.lat - point.lat);                
                if(precision < 2e-10 && precision > -2e-10){//ʵ���ж��Ƿ�ӽ�0
                    return true;
                }                
            }
        }
        
        return false;
    }
    
    /**
     * �жϵ��Ƿ�������
     * @param {Point} point �����
     * @param {Polyline} polygon ����ζ���
     * @returns {Boolean} ���ڶ�����ڷ���true,���򷵻�false
     */
    GeoUtils.isPointInPolygon = function(point, polygon){
        //�������
        if(!(point instanceof BMap.Point) ||
            !(polygon instanceof BMap.Polygon)){
            return false;
        }

        //�����жϵ��Ƿ��ڶ���ε���������ڣ�����ڣ����һ���жϣ����򷵻�false
        var polygonBounds = polygon.getBounds();
        if(!this.isPointInRect(point, polygonBounds)){
            return false;
        }

        var pts = polygon.getPath();//��ȡ����ε�
        
        //����������Դ��http://paulbourke.net/geometry/insidepoly/�������˲����޸�
        //����˼�����������߷����������������θ��ߵĽ��㣬�����ż��������ڶ�����⣬����
        //�ڶ�����ڡ����ῼ��һЩ�������������ڶ���ζ����ϣ����ڶ���α��ϵ����������
        
        var N = pts.length;
        var boundOrVertex = true; //�����λ�ڶ���εĶ������ϣ�Ҳ�������ڶ�����ڣ�ֱ�ӷ���true
        var intersectCount = 0;//cross points count of x 
        var precision = 2e-10; //�������ͼ���ʱ����0�Ƚ�ʱ����ݲ�
        var p1, p2;//neighbour bound vertices
        var p = point; //���Ե�
        
        p1 = pts[0];//left vertex        
        for(var i = 1; i <= N; ++i){//check all rays            
            if(p.equals(p1)){
                return boundOrVertex;//p is an vertex
            }
            
            p2 = pts[i % N];//right vertex            
            if(p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)){//ray is outside of our interests                
                p1 = p2; 
                continue;//next ray left point
            }
            
            if(p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)){//ray is crossing over by the algorithm (common part of)
                if(p.lng <= Math.max(p1.lng, p2.lng)){//x is before of ray                    
                    if(p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)){//overlies on a horizontal ray
                        return boundOrVertex;
                    }
                    
                    if(p1.lng == p2.lng){//ray is vertical                        
                        if(p1.lng == p.lng){//overlies on a vertical ray
                            return boundOrVertex;
                        }else{//before ray
                            ++intersectCount;
                        } 
                    }else{//cross point on the left side                        
                        var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng                        
                        if(Math.abs(p.lng - xinters) < precision){//overlies on a ray
                            return boundOrVertex;
                        }
                        
                        if(p.lng < xinters){//before ray
                            ++intersectCount;
                        } 
                    }
                }
            }else{//special case when ray is crossing through the vertex                
                if(p.lat == p2.lat && p.lng <= p2.lng){//p crossing over p2                    
                    var p3 = pts[(i+1) % N]; //next vertex                    
                    if(p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)){//p.lat lies between p1.lat & p3.lat
                        ++intersectCount;
                    }else{
                        intersectCount += 2;
                    }
                }
            }            
            p1 = p2;//next ray left point
        }
        
        if(intersectCount % 2 == 0){//ż���ڶ������
            return false;
        } else { //�����ڶ������
            return true;
        }            
    }

    /**
     * ����ת��Ϊ����
     * @param {degree} Number ��     
     * @returns {Number} ����
     */
    GeoUtils.degreeToRad =  function(degree){
        return Math.PI * degree/180;    
    }
    
    /**
     * ������ת��Ϊ��
     * @param {radian} Number ����     
     * @returns {Number} ��
     */
    GeoUtils.radToDegree = function(rad){
        return (180 * rad) / Math.PI;       
    }
    
    /**
     * ��vֵ�޶���a,b֮�䣬γ��ʹ��
     */
    function _getRange(v, a, b){
        if(a != null){
          v = Math.max(v, a);
        }
        if(b != null){
          v = Math.min(v, b);
        }
        return v;
    }
    
    /**
     * ��vֵ�޶���a,b֮�䣬����ʹ��
     */
    function _getLoop(v, a, b){
        while( v > b){
          v -= b - a
        }
        while(v < a){
          v += b - a
        }
        return v;
    }

    /**
     * ��������֮��ľ���,�����������Ϊ��γ��
     * @param {point1} Point �����
     * @param {point2} Point �����
     * @returns {Number} ����֮����룬��λΪ��
     */
    GeoUtils.getDistance = function(point1, point2){
        //�ж�����
        if(!(point1 instanceof BMap.Point) ||
            !(point2 instanceof BMap.Point)){
            return 0;
        }

        point1.lng = _getLoop(point1.lng, -180, 180);
        point1.lat = _getRange(point1.lat, -74, 74);
        point2.lng = _getLoop(point2.lng, -180, 180);
        point2.lat = _getRange(point2.lat, -74, 74);
        
        var x1, x2, y1, y2;
        x1 = GeoUtils.degreeToRad(point1.lng);
        y1 = GeoUtils.degreeToRad(point1.lat);
        x2 = GeoUtils.degreeToRad(point2.lng);
        y2 = GeoUtils.degreeToRad(point2.lat);

        return EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)));    
    }
    
    /**
     * �������߻��ߵ�����ĳ���
     * @param {Polyline|Array<Point>} polyline ���߶�����ߵ�����
     * @returns {Number} ���߻�������Ӧ�ĳ���
     */
    GeoUtils.getPolylineDistance = function(polyline){
        //�������
        if(polyline instanceof BMap.Polyline || 
            polyline instanceof Array){
            //��polylineͳһΪ����
            var pts;
            if(polyline instanceof BMap.Polyline){
                pts = polyline.getPath();
            } else {
                pts = polyline;
            }
            
            if(pts.length < 2){//С��2���㣬����0
                return 0;
            }

            //���������߶ν�����ӣ����������߶εĳ���
            var totalDis = 0;
            for(var i =0; i < pts.length - 1; i++){
                var curPt = pts[i];
                var nextPt = pts[i + 1]
                var dis = GeoUtils.getDistance(curPt, nextPt);
                totalDis += dis;
            }

            return totalDis;
            
        } else {
            return 0;
        }
    }
    
    /**
     * ���������������鹹��ͼ�ε����,ע�⣺��������ֻ���Ǿ�γ�ȣ��Ҳ��ʺϼ������ཻ����ε����
     * @param {Polygon|Array<Point>} polygon ������������ߵ�����
     * @returns {Number} ������������鹹��ͼ�ε����
     */
    GeoUtils.getPolygonArea = function(polygon){
        //�������
        if(!(polygon instanceof BMap.Polygon) &&
            !(polygon instanceof Array)){
            return 0;
        }
        var pts;
        if(polygon instanceof BMap.Polygon){
            pts = polygon.getPath();
        }else{
            pts = polygon;    
        }
        
        if(pts.length < 3){//С��3�����㣬���ܹ�����
            return 0;
        }
        
        var totalArea = 0;//��ʼ�������
        var LowX = 0.0;
        var LowY = 0.0;
        var MiddleX = 0.0;
        var MiddleY = 0.0;
        var HighX = 0.0;
        var HighY = 0.0;
        var AM = 0.0;
        var BM = 0.0;
        var CM = 0.0;
        var AL = 0.0;
        var BL = 0.0;
        var CL = 0.0;
        var AH = 0.0;
        var BH = 0.0;
        var CH = 0.0;
        var CoefficientL = 0.0;
        var CoefficientH = 0.0;
        var ALtangent = 0.0;
        var BLtangent = 0.0;
        var CLtangent = 0.0;
        var AHtangent = 0.0;
        var BHtangent = 0.0;
        var CHtangent = 0.0;
        var ANormalLine = 0.0;
        var BNormalLine = 0.0;
        var CNormalLine = 0.0;
        var OrientationValue = 0.0;
        var AngleCos = 0.0;
        var Sum1 = 0.0;
        var Sum2 = 0.0;
        var Count2 = 0;
        var Count1 = 0;
        var Sum = 0.0;
        var Radius = EARTHRADIUS; //6378137.0,WGS84����뾶 
        var Count = pts.length;        
        for (var i = 0; i < Count; i++) {
            if (i == 0) {
                LowX = pts[Count - 1].lng * Math.PI / 180;
                LowY = pts[Count - 1].lat * Math.PI / 180;
                MiddleX = pts[0].lng * Math.PI / 180;
                MiddleY = pts[0].lat * Math.PI / 180;
                HighX = pts[1].lng * Math.PI / 180;
                HighY = pts[1].lat * Math.PI / 180;
            }
            else if (i == Count - 1) {
                LowX = pts[Count - 2].lng * Math.PI / 180;
                LowY = pts[Count - 2].lat * Math.PI / 180;
                MiddleX = pts[Count - 1].lng * Math.PI / 180;
                MiddleY = pts[Count - 1].lat * Math.PI / 180;
                HighX = pts[0].lng * Math.PI / 180;
                HighY = pts[0].lat * Math.PI / 180;
            }
            else {
                LowX = pts[i - 1].lng * Math.PI / 180;
                LowY = pts[i - 1].lat * Math.PI / 180;
                MiddleX = pts[i].lng * Math.PI / 180;
                MiddleY = pts[i].lat * Math.PI / 180;
                HighX = pts[i + 1].lng * Math.PI / 180;
                HighY = pts[i + 1].lat * Math.PI / 180;
            }
            AM = Math.cos(MiddleY) * Math.cos(MiddleX);
            BM = Math.cos(MiddleY) * Math.sin(MiddleX);
            CM = Math.sin(MiddleY);
            AL = Math.cos(LowY) * Math.cos(LowX);
            BL = Math.cos(LowY) * Math.sin(LowX);
            CL = Math.sin(LowY);
            AH = Math.cos(HighY) * Math.cos(HighX);
            BH = Math.cos(HighY) * Math.sin(HighX);
            CH = Math.sin(HighY);
            CoefficientL = (AM * AM + BM * BM + CM * CM) / (AM * AL + BM * BL + CM * CL);
            CoefficientH = (AM * AM + BM * BM + CM * CM) / (AM * AH + BM * BH + CM * CH);
            ALtangent = CoefficientL * AL - AM;
            BLtangent = CoefficientL * BL - BM;
            CLtangent = CoefficientL * CL - CM;
            AHtangent = CoefficientH * AH - AM;
            BHtangent = CoefficientH * BH - BM;
            CHtangent = CoefficientH * CH - CM;
            AngleCos = (AHtangent * ALtangent + BHtangent * BLtangent + CHtangent * CLtangent) / (Math.sqrt(AHtangent * AHtangent + BHtangent * BHtangent + CHtangent * CHtangent) * Math.sqrt(ALtangent * ALtangent + BLtangent * BLtangent + CLtangent * CLtangent));
            AngleCos = Math.acos(AngleCos);            
            ANormalLine = BHtangent * CLtangent - CHtangent * BLtangent;
            BNormalLine = 0 - (AHtangent * CLtangent - CHtangent * ALtangent);
            CNormalLine = AHtangent * BLtangent - BHtangent * ALtangent;
            if (AM != 0)
                OrientationValue = ANormalLine / AM;
            else if (BM != 0)
                OrientationValue = BNormalLine / BM;
            else
                OrientationValue = CNormalLine / CM;
            if (OrientationValue > 0) {
                Sum1 += AngleCos;
                Count1++;
            }
            else {
                Sum2 += AngleCos;
                Count2++;
            }
        }        
        var tempSum1, tempSum2;
        tempSum1 = Sum1 + (2 * Math.PI * Count2 - Sum2);
        tempSum2 = (2 * Math.PI * Count1 - Sum1) + Sum2;
        if (Sum1 > Sum2) {
            if ((tempSum1 - (Count - 2) * Math.PI) < 1)
                Sum = tempSum1;
            else
                Sum = tempSum2;
        }
        else {
            if ((tempSum2 - (Count - 2) * Math.PI) < 1)
                Sum = tempSum2;
            else
                Sum = tempSum1;
        }
        totalArea = (Sum - (Count - 2) * Math.PI) * Radius * Radius;

        return totalArea; //���������
    }
   
})();//�հ�����