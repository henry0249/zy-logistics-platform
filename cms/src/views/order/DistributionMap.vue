<template>
  <loading-box v-model="laodingText">
    <div class="flex jb" style="min-height:420px">
      <div style="width:33%;font-size:12px">
        <distribution-step @save="save" :data.sync="points"></distribution-step>
      </div>
      <div style="width:65%">
        <loading-box v-model="mapLoading">
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
              <!-- <el-checkbox v-model="showPoint">轨迹点</el-checkbox> -->
              <!-- <el-checkbox v-if="showPoint" v-model="showPointIndex">轨迹索引</el-checkbox> -->
            </bm-control>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-context-menu>
              <bm-context-menu-item :callback="addPointNomal" text="添加轨迹点"></bm-context-menu-item>
              <bm-context-menu-item :callback="addPointTransfer" text="添加中转点"></bm-context-menu-item>
              <bm-context-menu-item :callback="addPointFinish" text="添加终点"></bm-context-menu-item>
            </bm-context-menu>
            <bm-marker v-if="item.type === 0 || item.type === 3 || index === points.length-1 || showPoint" v-for="(item,index) in points" :key="index" :position="item" :dragging="true" @dragend="dragend($event,index)" :icon="pointIcon(item,index)">
              <bm-label v-if="showPointIndex" :content="(index+1).toString()" :labelStyle="{color: 'red', fontSize : '12px'}" :offset="{width: 4, height: 20}" />
            </bm-marker>
            <bm-polyline shape="BMAP_POINT_SHAPE_STAR" :path="points" :stroke-opacity="0.5" :stroke-weight="3"></bm-polyline>
            <div class="hide-baidu">
              <div class="flex ac" style="padding:10px 0">
                <div class="f1"></div>
                <el-button size="mini" type="primary" icon="el-icon-refresh">刷新</el-button>
              </div>
            </div>
          </baidu-map>
        </loading-box>
      </div>
    </div>
  </loading-box>
</template>

<script>
import DistributionStep from "./DistributionStep";
export default {
  components: {
    DistributionStep
  },
  data() {
    return {
      laodingText: "加载中...",
      showPoint: false,
      showPointIndex: false,
      points: [],
      mapLoading: ""
    };
  },
  watch: {
    points(val) {
      // console.log(val);
    }
  },
  methods: {
    pointIcon(item, index) {
      let icon = {
        url:
          "http://bymm.oss-cn-shenzhen.aliyuncs.com/2018-07-03-%E7%82%B9-2.png",
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
    removePoint(e) {},
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
    },
    addPointNomal(e) {
      this.points.forEach((item, index) => {
        if (item.type === 3) {
          item.type = 1;
          this.points.splice(index, 1, item);
        }
      });
      this.addPoint(e, 1);
    },
    addPointTransfer(e) {
      this.points.forEach((item, index) => {
        if (item.type === 3) {
          item.type = 1;
          this.points.splice(index, 1, item);
        }
      });
      this.addPoint(e, 2);
    },
    addPointFinish(e) {
      this.points.forEach((item, index) => {
        if (item.type === 3) {
          item.type = 1;
          this.points.splice(index, 1, item);
        }
      });
      this.addPoint(e, 3);
    },
    async addPoint(e, type = 1) {
      if (this.points.length === 0) {
        type = 0;
      }
      let item = e.point;
      item.type = type;
      item.index = this.points.length;
      this.mapLoading = "正在解析地址";
      try {
        let res = await this.$ajax.post("/map/geocoder", e.point);
        item.address = res.formatted_address + " " + res.sematic_description;
        item.addressComponent = res.addressComponent;
        item.sematic_description = res.sematic_description;
      } catch (error) {}
      this.mapLoading = "";
      item.time = new Date();
      this.points.push(item);
    },
    async save(data) {
      console.log(data);
      this.laodingText = "正在保存...";
      try {
        let res = await this.$ajax.post("/logisticsTrajectory/add", {
          logistics: this.$route.params._id,
          point: data
        });
        await this.setPoint();
      } catch (error) {}
      this.laodingText = "";
    },
    async setPoint() {
      this.laodingText = "加载中...";
      try {
        this.points = [];
        let res = await this.$ajax.post("/logisticsTrajectory/find", {
          logistics: this.$route.params._id,
          sort: {
            time: 1
          }
        });
        this.points = res;
      } catch (error) {}
      setTimeout(() => {
        this.laodingText = "";
      }, 500);
    }
  },
  created() {
    this.setPoint();
  }
};
</script>

<style scoped>
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