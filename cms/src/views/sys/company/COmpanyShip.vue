<template>
  <loading-box v-model="loadingText" class="role-box">
    <el-tabs v-model="activeName" type="card" style="box-shadow:none;">
      <el-tab-pane label="车辆信息" name="truck">
        <company-ship-item :data="truckData" :thead="thead" key="truck"></company-ship-item>
      </el-tab-pane>
      <el-tab-pane label="船只信息" name="ship">
      </el-tab-pane>
    </el-tabs>
    <div class="jc" v-if="show()" style="position:absolute;top:0;right:0;height:40px;" :title="`添加${typeText()}`">
      <el-button type="success" @click="add" size="mini">添加{{typeText()}}</el-button>
    </div>
  </loading-box>
</template>

<script>
import CompanyShipItem from "./CompanyShipItem.vue";
export default {
  components: {
    CompanyShipItem
  },
  data() {
    return {
      activeName: "",
      loadingText: "",
      truckData: [],
      shipData: []
    };
  },
  computed: {
    thead() {
      if (this.activeName === "truck") {
        return {
          no: {
            name: "车牌号"
          },
          name: {
            name: "名称"
          },
          type: {
            name: "类型",
            slot: true,
            readOnly: true
          },
          owner: {
            name: "司机",
            slot: true,
            readOnly: true
          }
        };
      } else if (this.activeName === "ship") {
        return {
          no: {
            name: "船号"
          },
          name: {
            name: "名称"
          },
          type: {
            name: "类型",
            slot: true,
            readOnly: true
          },
          owner: {
            name: "司机",
            slot: true,
            readOnly: true
          }
        };
      }
    }
  },
  methods: {
    show() {
      if (this.activeName === "ship" || this.activeName === "truck") {
        return true;
      }
    },
    typeText() {
      if (this.activeName === "ship") {
        return "船只";
      } else if (this.activeName === "truck") {
        return "车辆";
      } else {
        return "";
      }
    },
    add() {},
    async getTruc(){
      try {
        this.truckData = await this.$api.curd({
          model:'truck',
          curdType:''
        })
      } catch (error) {
        
      }
    }
  }
};
</script>

<style scoped>
.role-box {
  position: relative;
}
</style>