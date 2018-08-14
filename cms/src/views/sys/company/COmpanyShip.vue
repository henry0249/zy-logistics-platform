<template>
  <div class="role-box">
    <el-tabs v-model="activeName" type="card" style="box-shadow:none;">
      <el-tab-pane label="车辆信息" name="truck">
        <company-ship-item str="Truck" :removeArr="truckRemoveArr" :activeName="activeName" :thead="truckThead" :data.sync="truckData" key="truck"></company-ship-item>
      </el-tab-pane>
      <el-tab-pane label="船只信息" name="ship">
        <company-ship-item str="Ship" :removeArr="shipRemoveArr" :activeName="activeName" :thead="shipThead" :data.sync="shipData" key="ship"></company-ship-item>
      </el-tab-pane>
    </el-tabs>
    <div class="jc" v-if="show()" style="position:absolute;top:0;right:0;height:40px;" :title="`添加${typeText()}`">
      <el-button type="success" @click="add" size="mini">添加{{typeText()}}</el-button>
    </div>
  </div>
</template>

<script>
  import CompanyShipItem from "./CompanyShipItem.vue";
  export default {
    components: {
      CompanyShipItem
    },
    props: {
      type: {
        type: String,
        default: "edmit"
      },
      removeObj: {
        type: Object,
        default () {
          return {};
        }
      },
      startData: {
        type: Object,
        default () {
          return {};
        }
      },
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      isLogistics: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        truckRemoveArr: [],
        shipRemoveArr: [],
        activeName: "truck",
        truckData: [],
        shipData: [],
        truckThead: {
          no: {
            name: "车牌号"
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
        },
        shipThead: {
          no: {
            name: "船号"
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
        }
      };
    },
    watch: {
      truckRemoveArr: {
        handler(val) {
          let data = JSON.parse(JSON.stringify(this.removeObj));
          this.$set(data, "truck", val);
        },
        deep: true
      },
      shipRemoveArr: {
        handler(val) {
          let data = JSON.parse(JSON.stringify(this.removeObj));
          this.$set(data, "ship", val);
        },
        deep: true
      },
      shipData: {
        handler(val, oldVal) {
          if (oldVal.length > 0) {
            let data = JSON.parse(JSON.stringify(this.data));
            this.$set(data, "ship", val);
            this.$emit("update:data", data);
          }
        },
        deep: true
      },
      truckData: {
        handler(val, oldVal) {
          if (oldVal.length > 0) {
            let data = JSON.parse(JSON.stringify(this.data));
            this.$set(data, "truck", val);
            this.$emit("update:data", data);
          }
        },
        deep: true
      },
      activeName(val) {
        if (!this.isLogistics) {
          if (val === "ship" || val === "truck") {
            this.$alert("该公司不是物流公司，不能添加车船", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.activeName = "";
              }
            });
          }
        }
      }
    },
    computed: {},
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
      add() {
        if (this.isLogistics) {
          let obj = {
            no: "",
            type: [],
            owner: {}
          };
          if (this.activeName === "ship") {
            this.shipData.unshift(obj);
          } else if (this.activeName === "truck") {
            this.truckData.unshift(obj);
          }
        } else {
          this.$alert("该公司不是物流公司，不能添加车船", "提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        }
      }
    },
    async created() {
      if (this.type === 'edmit') {
        this.truckData = JSON.parse(JSON.stringify(this.startData.truck));
        this.shipData = JSON.parse(JSON.stringify(this.startData.ship));
      }
    }
  };
</script>

<style scoped>
  .role-box {
    position: relative;
  }
</style>