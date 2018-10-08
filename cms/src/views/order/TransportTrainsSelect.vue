<template>
  <div>
    <el-tooltip effect="dark" content="点击可关联物流运单,同步显示运输途中商品数量" placement="top">
      <div class="link" style="margin:0 5px" @click="showDialog">运输中数量：{{totalLoading}}</div>
    </el-tooltip>
    <el-dialog title="选择关联物流单" :visible.sync="dialogVisible" width="80%" top="10vh">
      <div v-if="dialogVisible">
        <div class="hor-scroll" style="font-size:13px;margin-bottom:10px">
          <div class="hor-scroll-item info" style="margin-right:10px">
            物流链
          </div>
          <div class="hor-scroll-item" v-for="(item,index) in transportTrainsArr" :key="index">
            <div class="flex ac">
              <div :class="{'select-item':index!==0,active:item._id === currentTransportTrains}" @click="changeTransportTrains(item,index)">
                {{areaInfo(item)}}
              </div>
              <div v-if="index!==transportTrainsArr.length-1" class="tc" style="width:40px">
                <i class="el-icon-d-arrow-right success"></i>
              </div>
            </div>
          </div>
        </div>
        <loading-box style="margin-top:15px" v-model="loadingText">
          <my-table ref="table" selection border size="mini" height="40vh" :thead="thead" :data.sync="tableData" :select.sync="relationLogistics" @selection-change="handleSelectionChange">
            <div slot-scope="scope">
              <div v-if="scope.prop==='no'">
                {{scope.row.no}}
              </div>
              <div v-if="scope.prop==='transportation'">
                <my-select truck :type.sync="scope.row.transportation" :data.sync="scope.row[scope.row.transportation]" placeholder="运输工具" disabled></my-select>
              </div>
              <my-form-item v-if="scope.prop==='loading'" v-model="scope.row.loading" size="mini" :min="0">
              </my-form-item>
              <my-form-item v-if="scope.prop==='landed'" v-model="scope.row.landed" size="mini" :min="0">
              </my-form-item>
              <my-form-item v-if="scope.prop==='price'" v-model="scope.row.price" size="mini" :min="0">
              </my-form-item>
              <div v-if="scope.prop==='state'">
                {{field.Logistics.state.option[scope.row.state]}}
              </div>
            </div>
          </my-table>
        </loading-box>
        <div class="flex ac" style="margin-top:25px">
          <div class="info">
            <span class="blue">{{relationLogistics.length}}</span> 条物流，装货量合
            <span class="blue">{{totalLoading}}</span>
          </div>
          <div class="hor-scroll" style="margin:0 15px">
            <div class="hor-scroll-item no-item info" v-if="relationLogistics.length === 0">
              未选择
            </div>
            <div class="hor-scroll-item no-item info" v-for="(item,index) in relationLogistics" :key="item.id">
              {{ item.no }}：<span class="blue">{{item.loading}}</span>&nbsp;&nbsp;<i @click="relationLogisticsRemove(item,index)" class="el-icon-close el-icon--left pointer"></i>
            </div>
          </div>
          <div class="flex ac" slot="footer">
            <el-button size="small" @click="cancel">关 闭</el-button>
            <el-button type="primary" @click="submit" size="small">确认关联</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { logisticsTable } from "./field";
export default {
  props: {
    order: {
      type: Object,
      default() {
        return {};
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    businessTrains: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loadingText: "",
      dialogVisible: false,
      transportTrainsArr: [],
      currentTransportTrains: "",
      limit: 0,
      thead: {
        ...logisticsTable
      },
      tableData: [],
      relationLogisticsObj: {},
      relationLogistics: []
    };
  },
  computed: {
    totalLoading() {
      let res = 0;
      this.relationLogistics.forEach(item => {
        res += Number(item.loading);
      });
      return res;
    }
  },
  methods: {
    showDialog() {
      if (!this.businessTrains._id) {
        this.$alert("贸易链尚未提交,请提交后再试", "提示", {
          type: "warning",
          center: true
        });
        return;
      }
      if (this.order.transportTrains && this.order.transportTrains.length > 0) {
        this.dialogVisible = true;
      } else {
        this.$alert("订单中尚未添加任何物流运单，请添加后再尝试关联", "提示", {
          type: "warning",
          center: true
        });
        return;
      }
      if (this.order.transportTrains && this.order.transportTrains.length > 0) {
        this.transportTrainsArr = [...this.order.transportTrains];
        this.currentTransportTrains = this.transportTrainsArr[1]._id;
        this.getData();
      }
    },
    async getData() {
      this.loadingText = "加载中";
      try {
        this.tableData = await this.$ajax.post("/logistics/find", {
          transportTrains: this.currentTransportTrains,
          limit: this.limit,
          populate: [
            {
              path: "truck"
            },
            {
              path: "ship"
            }
          ]
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async getRelationLogistics() {
      this.loadingText = "加载中";
      try {
        this.relationLogistics = await this.$ajax.post("/logistics/find", {
          limit: 0,
          businessTrains: this.businessTrains
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async loadMore() {
      return await this.$ajax.post("/logistics/find", {
        transportTrains: this.currentTransportTrains,
        limit: this.limit,
        skip: this.tableData.length,
        populate: [
          {
            path: "truck"
          },
          {
            path: "ship"
          }
        ]
      });
    },
    areaInfo(item) {
      let res = "请选择地址";
      if (!item) {
        return res;
      }
      if (Number(item.type) === 1) {
        if (item.areaType === 0) {
          if (item.areaArr instanceof Array && item.areaArr.length > 0) {
            let temp = [];
            item.areaArr.forEach(item => {
              temp.push(item.name);
            });
            res = temp.join("/");
          }
        } else {
          res = this.area2name(item.area);
        }
      } else {
        res = this.area2name(item.area);
      }
      return res;
    },
    async changeTransportTrains(item, index) {
      if (index !== 0) {
        this.currentTransportTrains = item._id;
        await this.getData();
        this.$refs.table.toggleRowSelection(this.relationLogistics);
      }
    },
    handleSelectionChange(val) {
      this.$set(this.relationLogisticsObj, this.currentTransportTrains, val);
      setTimeout(() => {
        this.setRelationLogistics();
      }, 200);
    },
    setRelationLogistics() {
      let res = [];
      for (const key in this.relationLogisticsObj) {
        if (this.relationLogisticsObj[key]) {
          this.relationLogisticsObj[key].forEach(item => {
            res.push(item);
          });
        }
      }
      this.relationLogistics = [...res];
    },
    relationLogisticsRemove(item, index) {
      this.relationLogistics.splice(index, 1);
      for (const key in this.relationLogisticsObj) {
        let itemArr = this.relationLogisticsObj[key];
        itemArr.forEach((objArrItem, objArrIndex) => {
          if (objArrItem._id === item._id) {
            itemArr.splice(objArrIndex, 1);
          }
        });
      }
      this.$refs.table.toggleRowSelection(this.relationLogistics);
    },
    cancel() {
      this.dialogVisible = false;
    },
    async submit() {
      if (this.relationLogistics.length === 0) {
        this.$message.error("尚未选择物流单");
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.6)"
      });
      try {
        let logisticsIdArr = [];
        this.relationLogistics.forEach(item => {
          logisticsIdArr.push(item._id);
        });
        await this.$ajax.post("/businessTrains/update", {
          find: { _id: this.businessTrains._id },
          update: {
            logistics: logisticsIdArr
          }
        });
      } catch (error) {}
      this.dialogVisible = false;
      this.businessTrains.logistics = [...this.relationLogistics];
      loading.close();
      this.$message.success("关联成功");
    }
  },
  mounted() {
    this.relationLogistics = [...this.businessTrains.logistics];
    this.businessTrains.logistics.forEach(item => {
      if (this.relationLogisticsObj[item.transportTrains]) {
        this.relationLogisticsObj[item.transportTrains].push(item);
      } else {
        this.relationLogisticsObj[item.transportTrains] = [];
        this.relationLogisticsObj[item.transportTrains].push(item);
      }
    });
  }
};
</script>

<style scoped>
.select-item {
  margin: 5px;
  margin-bottom: 10px;
  padding: 10px 15px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  cursor: pointer;
}
.select-item.active {
  background: #409eff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  color: #fff;
}
.no-item {
  margin: 5px;
  margin-bottom: 5px;
  padding: 5px 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}
</style>