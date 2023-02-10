<template>
  <div class="main">
    <div id="map"></div>
    <p class="my-controls"></p>
  </div>
</template>

<script>
import "ol/ol.css";
import { Map, View, Feature } from 'ol'
import TileGrid from "ol/tilegrid/TileGrid";
import { get, fromLonLat } from 'ol/proj'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { TileImage, XYZ, Vector as VectorSource, OSM } from 'ol/source'
import { Point, LineString, Circle } from 'ol/geom'
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";

export default {
  name: "MyMap",
  components: {},
  mounted () {
    this.$nextTick(() => {
      this.initMap();
      this.addPoint()
      this.addLine()
      this.addCircle()
    });
  },
  data () {
    return {
      myMap: null,
    };
  },
  methods: {
    initMap () {
      //高德地图
      let AMapLayer = new TileLayer({
        source: new XYZ({
          url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}",
        }),
      });

      //google地图 不显示
      let googleMapLayer = new TileLayer({
        source: new XYZ({
          url: "http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0",
        }),
      });

      //百度地图
      let projection = get("EPSG:3857");
      let resolutions = [];
      for (let i = 0; i < 19; i++) {
        resolutions[i] = Math.pow(2, 18 - i);
      }

      let tilegrid = new TileGrid({
        origin: [0, 0],
        resolutions: resolutions,
      });

      let baidu_source = new TileImage({
        projection: projection,
        tileGrid: tilegrid,
        tileUrlFunction: function (tileCoord, pixelRatio, proj) {
          if (!tileCoord) {
            return "";
          }
          let z = tileCoord[0];
          let x = tileCoord[1];
          let y = tileCoord[2];
          if (x < 0) {
            x = "M" + -x;
          }
          if (y < 0) {
            y = "M" + -y;
          }
          return (
            "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
            x +
            "&y=" +
            y +
            "&z=" +
            z +
            "&styles=pl&udt=20170809&scaler=1&p=1"
          );
        },
      });

      let baiduMapLayer = new TileLayer({
        source: baidu_source,
      });

      this.myMap = new Map({
        target: "map",
        layers: [AMapLayer],
        //layers: [
        //  new TileLayer({
        //    // 使用瓦片渲染方法
        //    source: new OSM(), // 图层数据源
        //  }),
        //],
        view: new View({
          center: fromLonLat([116.3, 39.9]),
          zoom: 12,
          //projection: "EPSG:4326", // 坐标系
        }),
      });
    },

    addPoint () {
      // 创建几何（圆）
      let point = new Point(fromLonLat([116.3, 39.9]));

      // 创建样式
      const fill = new Fill({
        color: "green",
      });
      const stroke = new Stroke({
        color: "green",
        width: 25,
      });
      const styles = [
        new Style({
          image: new CircleStyle({
            fill: fill,
            stroke: stroke,
            radius: 5,
          }),
          fill: fill,
          stroke: stroke,
        }),
      ];

      // 创建矢量对象
      let feature = new Feature({
        geometry: point,
      });
      // 创建矢量源
      var source = new VectorSource({});

      // 把要素集合添加到源 addFeatures
      source.addFeature(feature);
      // 创建矢量层
      var vector = new VectorLayer({
        source: source,
        style: styles,
        id: "point1",
      });
      // 把源添加到地图
      this.myMap.addLayer(vector);
    },

    addLine () {
      // map.addLayer(Vector) ：将矢量层添加到map
      // Vector设置source属性：将源添加到矢量层
      // Source设置feature属性：将矢量对象添加到源
      // Feature设置geometry属性：将几何添加到矢量对象
      // Geometry包括简单几何：Point、LineString、Circle
      let line = new LineString([
        fromLonLat([116.3, 39.9]),
        fromLonLat([117.3, 40.9]),
      ])
      let features = new Feature({
        geometry: line
      })
      let source = new VectorSource()
      source.addFeature(features)
      // 填充样式
      const fill = new Fill({
        color: 'rgba(0,0,0,1)',
      });
      // 描边
      const stroke = new Stroke({
        color: 'red',
        width: 2,
      });
      const styles = [
        new Style({
          fill: fill,
          stroke: stroke,
        }),
      ];
      let vector = new VectorLayer({
        source: source,
        style: styles,
        id: 'line1',
      })
      this.myMap.addLayer(vector)
      console.log('线', this.myMap.getLayers())
    },

    addCircle () {
      let circle = new Circle(fromLonLat([116.3, 39.9]), 50)
      //       0: 12946456.779257717
      // 1: 4851421.175183355
      let features = new Feature({
        geometry: circle
      })
      let source = new VectorSource()
      source.addFeature(features)
      // 填充样式
      const fill = new Fill({
        color: 'rgba(0,0,0,1)',
      });
      // 描边
      const stroke = new Stroke({
        color: 'red',
        width: 2,
      });
      const styles = [
        new Style({
          image: new CircleStyle({
            fill: fill,
            stroke: stroke,
            radius: 5,
          }),
          fill: fill,
          stroke: stroke,
        }),
      ];
      let vector = new VectorLayer({
        source: source,
        style: styles,
        id: 'circle1',
      })
      this.myMap.addLayer(vector)
      console.log('圆', this.myMap.getLayers())
    },
  },
};
</script>
<style>
.main,
#map {
  width: 100%;
  height: 100%;
}

.ol-attributiona {
  color: black;
}
</style>
