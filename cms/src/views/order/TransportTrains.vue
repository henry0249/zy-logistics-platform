<template>
  <loading-box v-model="loadingText">
    <div class="flex ac jb" style="color:#909399;padding-left:25px;background:#f4f4f5;font-size:13px;margin-bottom:15px;border-radius:4px">
      <div class="f1" style="margin-right:20px">物流链</div>
      <div @click="add" class="success pointer" style="padding:10px">
        物流节点<i class="el-icon-plus"></i>
      </div>
    </div>
    <div>
      <div class="hor-scroll" style="margin-bottom:10px">
        <div class="hor-scroll-item" v-for="(item,index) in trains" :key="item._id || item.template_id">
          <div class="flex">
            <transport-trains-card :settle="settle" :data.sync="item" :order="order" :index="index" @remove="remove($event,index)">
            </transport-trains-card>
            <div class="tc col-flex jb" v-if="index!==trains.length-1" style="width:50px;height:220px">
              <div></div>
              <i class="el-icon-d-arrow-right success" :style="{color:showIndex === index?'#67C23A':'#C0C4CC'}"></i>
              <i class="el-icon-d-arrow-right success" :style="{color:showIndex === index?'#67C23A':'#C0C4CC'}"></i>
              <div @click="showIndex = index" class="tc pointer" style="margin-top:10px">
                <icon class="to-table" :color="showIndex === index?'#67C23A':'#C0C4CC'">icon-xiajiang</icon>
                <div style="font-size:12px" :style="{color:showIndex === index?'#67C23A':'#C0C4CC'}">运单详情</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-for="(item,index) in trains" :key="'table'+index">
        <div v-if="showIndex === index">
          <div class="flex ac jb brtl brtr" style="color:#909399;padding-left:10px;background:#f4f4f5;font-size:13px">
            <!-- <div>{{areaInfo(item)}}</div> -->
            <!-- <div>{{areaInfo(trains[index + 1])}}</div> -->
            <div class="f1 ac jb">
              <el-input size="mini" v-model="item.areaInfo" placeholder="请输入起送地点详情"></el-input>
              <i style="margin:0 15px" class="el-icon-d-arrow-right success"></i>
              <el-input size="mini" v-model="trains[index + 1].areaInfo" placeholder="请输入送达地点详情"></el-input>
            </div>
            <div class="success pointer" style="padding:10px" @click="addLogistics(item.logistics,index)">
              物流单<i class="el-icon-plus"></i>
            </div>
          </div>
          <my-table max-height="300" opWidth="45" size="mini" index border :thead="thead" :data.sync="item.logistics">
            <div class="tc" slot="op" slot-scope="scope">
              <remove-check @remove="removeLogistics(item.logistics,scope.index)"></remove-check>
            </div>
            <div slot-scope="scope">
              <div v-if="scope.prop==='no'">
                <div v-if="scope.row.no" @click="toDetail(scope.row)">
                  <span class="link">{{scope.row.no}}</span>
                  <el-tooltip v-if="scope.row.checkFail" effect="dark" :content="`${field.Logistics.checkFail.option[scope.row.checkFail]}`" placement="top">
                    <i class="el-icon-error danger"></i>
                  </el-tooltip>
                </div>
                <div v-else style="color:#ccc">未生成</div>
              </div>
              <div v-if="scope.prop==='transportation'">
                <my-select truck :type.sync="scope.row.transportation" :data.sync="scope.row[scope.row.transportation]" placeholder="运输工具" @change="transportationChange($event,scope.row)" :disabled="scope.row.dispatcherManagerCheck"></my-select>
              </div>
              <my-form-item v-if="scope.prop==='loading'" v-model="scope.row.loading" size="mini" type="number" min="0">
              </my-form-item>
              <my-form-item v-if="scope.prop==='landed'" v-model="scope.row.landed" size="mini" type="number" min="0">
              </my-form-item>
              <my-form-item v-if="scope.prop==='price'" v-model="scope.row.price" size="mini" type="number" min="0" :disabled="scope.row.dispatcherManagerCheck">
              </my-form-item>
              <my-form-item v-if="scope.prop==='balancePrice'" v-model="scope.row.balancePrice" size="mini" type="number" min="0">
              </my-form-item>
              <my-form-item v-if="scope.prop==='balanceCount'" v-model="scope.row.balanceCount" size="mini" type="number" min="0">
              </my-form-item>
              <relation-company v-if="scope.prop==='balanceCompany' && order._id" :order="order" :data.sync="scope.row.balanceCompany" business tranport :append="scope.row[scope.row.transportation] && scope.row[scope.row.transportation].company"></relation-company>
              <!-- <el-tooltip v-if="scope.prop==='balanceCompany'" effect="dark" content="仅可从本公司关联的公司中选择" placement="top">
                <my-form-item size="mini" v-model="scope.row.balanceCompany" select :options="companySelectList">
                </my-form-item>
              </el-tooltip> -->
              <my-form-item v-if="scope.prop==='loss'" v-model="scope.row.loss" size="mini" type="number" min="0">
              </my-form-item>
              <!-- <el-tooltip v-if="scope.prop==='lossCompany'" effect="dark" content="仅可从本公司关联的公司中选择" placement="top">
                <my-form-item size="mini" v-model="scope.row.lossCompany" select :options="companySelectList">
                </my-form-item>
              </el-tooltip> -->
              <relation-company v-if="scope.prop==='lossCompany' && order._id" :order="order" :data.sync="scope.row.lossCompany" business tranport :append="scope.row[scope.row.transportation] && scope.row[scope.row.transportation].company"></relation-company>
              <my-form-item v-if="scope.prop==='startAt'" v-model="scope.row.startAt" size="mini" datetime>
              </my-form-item>
              <my-form-item v-if="scope.prop==='finishAt'" v-model="scope.row.finishAt" size="mini" datetime>
              </my-form-item>
              <div v-if="scope.prop==='total'">
                {{Number(scope.row.price) * Number(scope.row.landed)}}
              </div>
              <my-form-item v-if="scope.prop==='state'" select size="mini" v-model="scope.row.state" :options="field.Logistics.state.option" @change="stateSelectChange($event,scope.row)">
              </my-form-item>
            </div>
          </my-table>
          <div class="flex ac bob bor bol brbl brbr" style="font-size:13px;color:#909399;padding:10px 0;background:#f4f4f5">
            <div class="tc" style="min-width:120px">
              订单数量：<span style="color:#409EFF">{{order.count}}</span>
            </div>
            <div class="f1"></div>
            <div class="tc" style="min-width:120px">
              总装货量：<span style="color:#67C23A">{{statistics.loading}}</span>
            </div>
            <div class="tc" style="min-width:120px">
              总卸货量：<span style="color:#F56C6C">{{statistics.landed}}</span>
            </div>
            <div class="tc" style="min-width:120px">
              平均运费：<span style="color:#E6A23C">{{statistics.average}}</span>
            </div>
            <div class="tc" style="min-width:120px">
              总运费：<span style="color:#E6A23C">{{statistics.totalPrice}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex ac" style="margin-top:15px">
        <div class="info">
          <i class="el-icon-info"></i> 提交将更新并且保存物流链所有信息,新增的物流单会进入审核流程
        </div>
        <div class="f1"></div>
        <div class="info" style="padding:0 10px">此次新增 <strong><span class="success">{{newLogisticsCount}}</span></strong> 张物流单</div>
        <el-button size="small" type="success" @click="dispatch">提交物流链信息</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
import { logistics, logisticsTable } from "../dispatch/field";
import TransportTrainsCard from "./TransportTrainsCard";
import RelationCompany from "./RelationCompany";
export default {
  components: {
    TransportTrainsCard,
    RelationCompany
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      }
    },
    val: {
      type: Array,
      default() {
        return [];
      }
    },
    alert: {
      type: String,
      default: "物流链"
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    settle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    statistics() {
      let res = {
        loading: 0,
        landed: 0,
        totalPrice: 0,
        count: 0,
        average: 0
      };
      this.trains.forEach(item => {
        if (item.logistics) {
          item.logistics.forEach(logisticsItem => {
            res.count++;
            res.loading += Number(logisticsItem.loading) || 0;
            res.landed += Number(logisticsItem.landed) || 0;
            res.totalPrice += Number(logisticsItem.price) || 0;
          });
        }
      });
      if (res.count > 0) {
        res.average = (res.totalPrice / res.count).toFixed(1);
      }
      return res;
    },
    companySelectList() {
      let transportTrainsRelationCompany =
        this.order.handle.transportTrainsRelationCompany || [];
      let businessRelationCompany =
        this.order.handle.businessRelationCompany || [];
      return [...transportTrainsRelationCompany, ...businessRelationCompany];
    },
    newLogisticsCount() {
      let res = 0;
      this.trains.forEach(item => {
        if (item.logistics) {
          item.logistics.forEach(logisticsItem => {
            if (!logisticsItem.no) {
              res++;
            }
          });
        }
      });
      return res;
    }
  },
  watch: {
    trains: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    }
  },
  data() {
    return {
      loadingText: "",
      trains: [],
      thead: {},
      showIndex: 0
    };
  },
  methods: {
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
    changeShowIndex(index) {
      if (index !== 0) {
        this.showIndex = index;
      }
    },
    add() {
      let lastItem = this.trains[this.trains.length - 1 - 1];
      if (Number(lastItem.areaType) === 0) {
        if (lastItem.areaArr.length === 0) {
          this.$message.error(
            `请先选择中转地${this.trains.length - 1 - 1}地址`
          );
          return;
        }
      } else {
        if (!lastItem.area._id) {
          this.$message.error(
            `请先选择中转地${this.trains.length - 1 - 1}地址`
          );
          return;
        }
      }
      this.trains.splice(-1, 0, {
        areaType: 1,
        type: 1,
        area: {},
        company: "",
        logistics: [],
        areaArr: [],
        template_id: new Date().getTime()
      });
    },
    async remove(item, index) {
      if (item._id) {
        this.loadingText = "加载中...";
        try {
          this.trains.splice(index, 1);
        } catch (error) {}
        this.loadingText = "";
      } else {
        this.trains.splice(index, 1);
      }
      if (this.showIndex > 1) {
        this.showIndex = this.showIndex - 1;
      }
    },
    addLogistics(logistics, index) {
      let lastItem = this.trains[index];
      if (Number(lastItem.areaType) === 0) {
        if (lastItem.areaArr.length === 0) {
          this.$message.error(
            `请先选择中转地${this.trains.length - 1 - 1}地址`
          );
          return;
        }
      } else {
        if (!lastItem.area._id) {
          this.$message.error(
            `请先选择中转地${this.trains.length - 1 - 1}地址`
          );
          return;
        }
      }
      logistics.push({
        loading: 0,
        landed: 0,
        price: 0,
        balancePrice: 0,
        balanceCount: 0,
        balanceCompany: "",
        loss: 0,
        lossCompany: "",
        state: 0,
        transportation: "truck",
        truck: {},
        ship: {}
      });
    },
    removeLogistics(logistics, index) {
      logistics.splice(index, 1);
    },
    transportationChange(val, logisticsItem) {
      if (logisticsItem.state === 0) {
        logisticsItem.state = 1;
      }
    },
    stateSelectChange(val, logisticsItem) {
      if (val === 0) {
        logisticsItem[logisticsItem.transportation] = {};
      }
    },
    async dispatch() {
      this.loadingText = "物流链信息提交中";
      try {
        await this.$ajax.post("/order/dispatch", {
          order: this.order._id,
          transportTrains: this.trains
        });
        this.$message.success("物流链信息更新成功");
        this.$emit("reflesh");
      } catch (error) {}
      this.loadingText = "";
    },
    toDetail(item) {
      if (item._id) {
        this.$router.push(
          `/dispatch/logistics/edit/${item._id}?role=dispatcher`
        );
      }
    }
  },
  created() {
    this.thead = {};
    if (this.settle) {
      for (const key in logistics) {
        this.$set(this.thead, key, logistics[key]);
      }
    } else {
      for (const key in logisticsTable) {
        this.$set(this.thead, key, logisticsTable[key]);
      }
    }
    if (this.val.length === 0) {
      let firstItem = {
        type: 0,
        areaType: 1,
        area: this.order.handle && this.order.handle.area,
        company: this.order.handle,
        logistics: [],
        template_id: new Date().getTime()
      };
      firstItem.areaInfo = this.areaInfo(firstItem);
      this.trains.push(firstItem);
      let lastItem = {
        type: 2,
        areaType: 1,
        area: this.order.area,
        logistics: [],
        [this.order.type]: this.order[this.order.type],
        template_id: new Date().getTime() + 1
      };
      lastItem.areaInfo = this.areaInfo(lastItem);
      this.trains.push(lastItem);
    } else {
      this.trains = JSON.parse(JSON.stringify(this.val));
    }
  }
};
</script>

<style scoped>
</style>