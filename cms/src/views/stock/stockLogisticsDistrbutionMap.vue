<template>
  <loading-box v-model="laodingText" class="myMapBox">
    <baidu-map class="map" center="广西">
      <bm-control>
        <el-tooltip :content="'轨迹点: ' + (showPoint?'显示':'隐藏')" placement="top">
          <el-switch style="margin:10px" v-model="showPoint" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-tooltip>
        <el-tooltip :content="'轨迹索引: ' + (showPointIndex?'显示':'隐藏')" placement="top">
          <el-switch style="margin:10px" v-model="showPointIndex" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-tooltip>
      </bm-control>
      <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <bm-polyline shape="BMAP_POINT_SHAPE_STAR" :path="points" :stroke-opacity="0.5" :stroke-weight="3"></bm-polyline>
      <bm-marker v-if="item.type === 0 || item.type === 3 || index === points.length-1 || showPoint" v-for="(item,index) in points" :key="index" :position="item" :dragging="true" @dragend="dragend($event,index)" :icon="pointIcon(item,index)">
        <bm-label v-if="showPointIndex" :content="(index+1).toString()" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: 4, height: 20}" />
      </bm-marker>
      <bm-polyline shape="BMAP_POINT_SHAPE_STAR" :path="points" :stroke-opacity="0.5" :stroke-weight="3"></bm-polyline>
    </baidu-map>
    <div class="hide-baidu"></div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      logisticsTrajectory: {
        type: Array,
        default () {
          return [];
        }
      },
    },
    data() {
      return {
        laodingText: "加载中...",
        showPoint: false,
        showPointIndex: false,
        points: [],
        mapLoading: "",
        removeData: []
      };
    },
    methods: {
      pointIcon(item, index) {
        let icon = {
          url: "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-07-03-%E7%82%B9-2.png",
          size: {
            width: 16,
            height: 16
          }
        };
        if (item.type === 2) {
          icon.url =
            "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-07-03-%E7%82%B9-1.png";
        }
        if (index === this.points.length - 1) {
          icon.size = {
            width: 16,
            height: 32
          };
          icon.url =
            "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-07-03-%E5%AE%9A%E4%BD%8D-2.png";
        }
        if (index === 0) {
          icon.size = {
            width: 15,
            height: 15
          };
          icon.url =
            "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-07-03-%E8%B5%B7%E7%82%B9-4.png";
        }
        return icon;
      },
      async dragend(e, index) {
        let item = JSON.parse(JSON.stringify(this.points[index]));
        this.mapLoading = "正在解析地址";
        try {
          let res = await this.$ajax.post("/map/geocoder", e.point);
          item.address = res.formatted_address + " " + res.sematic_description;
          item.addressComponent = res.addressComponent;
          item.sematic_description = res.sematic_description;
        } catch (error) {}
        this.mapLoading = "";
        item.lng = e.point.lng;
        item.lat = e.point.lat;
        item.time = new Date();
        this.points.splice(index, 1, item);
      }
    },
    created() {
      this.laodingText = "加载中...";
      this.points = this.logisticsTrajectory;
      setTimeout(() => {
        this.laodingText = "";
      }, 500);
    }
  }
</script>

<style scoped>
  .myMapBox {
    position: relative;
  }
  .map {
    width: 100%;
    height: 400px;
    position: relative;
  }
  .hide-baidu {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20px;
    background: #fff;
  }
</style>