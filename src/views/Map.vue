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
import { get, fromLonLat, transform } from 'ol/proj'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { TileImage, XYZ, Vector as VectorSource, OSM } from 'ol/source'
import { Point, LineString, Circle, MultiLineString, MultiPoint } from 'ol/geom'
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";

export default {
  name: "MyMap",
  components: {},
  mounted () {
    this.$nextTick(() => {
      this.initMap();
      this.addPoint()
      // this.addMultiPoint()
      this.addLine()
      // this.addMultiLine()
      this.addCircle()

      this.myMap.addEventListener('click', this.pointClick)
    });
  },
  data () {
    return {
      myMap: null,
    };
  },
  methods: {
    initMap () {
      //实例化map对象加载地图
      this.myMap = new Map({
        //地图容器div的id 
        target: 'map',
        //地图容器中加载的图层
        layers: [
          //加载瓦片图层数据
          new TileLayer({
            title: "天地图矢量图层",
            source: new XYZ({
              url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=be4550d65ca209abd20eee37103e3e03",
              wrapX: false
            })
          }),
          new TileLayer({
            title: "天地图矢量图层注记",
            source: new XYZ({
              url: "http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=be4550d65ca209abd20eee37103e3e03",
              wrapX: false
            })
          })
        ],
        //地图视图设置
        view: new View({
          //地图初始中心点
          center: transform([116.4, 40], 'EPSG:4326', 'EPSG:3857'), //地图初始中心点
          //地图初始显示级别
          zoom: 11
        })
      });
    },
    addPoint () {
      // 创建几何（点）
      let point = new Point(fromLonLat([116.39, 39.91]));

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
          image: new Icon({
            src: require('@/assets/img/map/icon3.png'),
            // width: 10,
            // height: 10,
            scale: 0.25
          }),
          // image: new CircleStyle({
          //   fill: fill,
          //   stroke: stroke,
          //   radius: 5,
          // }),
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
        fromLonLat([116.4, 40]),
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
        width: 4,
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
    },
    addMultiLine () {
      // map.addLayer(Vector) ：将矢量层添加到map
      // Vector设置source属性：将源添加到矢量层
      // Source设置feature属性：将矢量对象添加到源
      // Feature设置geometry属性：将几何添加到矢量对象
      // Geometry包括简单几何：Point、LineString、Circle
      let line = new MultiLineString([
        [fromLonLat([116.3, 39.9]),
        fromLonLat([116.4, 40])],
        [fromLonLat([116.4, 40]),
        fromLonLat([116.4, 39.91])]]
      )
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
        width: 4,
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
        id: 'MultiLineString1',
      })
      this.myMap.addLayer(vector)
    },
    addMultiPoint () {
      // 创建几何（点）
      let point = new MultiPoint([fromLonLat([116.39, 39.94]), fromLonLat([116.4, 39.9])]);

      const styles = [
        new Style({
          image: new Icon({
            src: require('@/assets/img/map/icon3.png'),
            width: 40,
            height: 40
          }),
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
        id: "MultiPoint1",
      });
      // 把源添加到地图
      this.myMap.addLayer(vector);
    },
    addCircle () {
      let circle = new Circle(fromLonLat([116.3, 39.9]), 1000)
      let features = new Feature({
        geometry: circle
      })
      let source = new VectorSource()
      source.addFeature(features)
      // 描边
      const stroke = new Stroke({
        color: 'red',
        width: 4,
      });
      const styles = [
        new Style({
          stroke: stroke,
        }),
      ];
      let vector = new VectorLayer({
        source: source,
        style: styles,
        id: 'circle1',
      })
      this.myMap.addLayer(vector)
    },
    // 点击落点,打个标记,高亮当前点
    pointClick (ev) {
      // 获取像素
      let pixel = ev.pixel;
      // 获取坐标
      let coordinate = ev.coordinate;
      let feature = this.myMap.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });
      console.log(coordinate, feature)
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
