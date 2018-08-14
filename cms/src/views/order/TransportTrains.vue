<template>
  <loading-box v-model="loadingText">
    <div class="flex ac jb" style="color:#909399;padding-left:25px;background:#f4f4f5;font-size:13px;margin:15px 0;border-radius:4px">
      <div class="f1" style="margin-right:20px">物流链</div>
      <div @click="add" class="success pointer" style="padding:10px">
        物流节点<i class="el-icon-plus"></i>
      </div>
    </div>
    <div>
      <div class="hor-scroll" style="margin-bottom:10px">
        <div class="hor-scroll-item" v-for="(item,index) in trains" :key="index">
          <div class="flex ac">
            <transport-trains-card :data.sync="item" :index="index" @remove="remove($event,index)"></transport-trains-card>
            <div v-if="index!==trains.length-1" style="padding:0 10px">
              <i class="el-icon-d-arrow-right success"></i>
            </div>
          </div>
          <div class="pointer flex ac jc" style="height:40px;line-height:40px" @click="changeShowIndex(index)">
            <icon v-if="index!==0" class="to-table" :color="showIndex === index?'#67C23A':'#eee'">icon-xiajiang</icon>
            <span v-if="index!==0" style="font-size:12px" :style="{color:showIndex === index?'#67C23A':'#eee'}">运单详情</span>
            <i v-if="index===0" style="opacity:0" class="el-icon-d-arrow-right success"></i>
          </div>
        </div>
      </div>
      <div v-for="(item,index) in trains" :key="'table'+index">
        <div v-if="showIndex === index">
          <div class="flex ac jb brtl brtr" style="color:#909399;padding-left:25px;background:#f4f4f5;font-size:13px">
            <div>{{area2name(trains[index - 1].area)}}</div>
            <i style="margin:0 15px" class="el-icon-d-arrow-right success"></i>
            <div>{{area2name(item.area)}}</div>
            <div class="f1"></div>
            <div class="success pointer" style="padding:10px" @click="addLogistics(item.logistics,index)">
              物流单<i class="el-icon-plus"></i>
            </div>
          </div>
          <my-table max-height="300" opWidth="45" size="mini" index border :thead="thead" op :data.sync="item.logistics">
            <div class="tc" slot="op" slot-scope="scope">
              <remove-check @remove="removeLogistics(item.logistics,scope.index)"></remove-check>
              <!-- <i @click="removeLogistics(item.logistics,scope.index)" class="el-icon-delete pointer danger"></i> -->
            </div>
            <div slot-scope="scope">
              <div v-if="scope.prop==='no'">
                <div v-if="scope.row.no">{{scope.row.no}}</div>
                <div v-else style="color:#ccc">未生成</div>
              </div>
              <div v-if="scope.prop==='transportation'" class="flex ac">
                <el-dropdown @command="handleCommand($event,scope.row)" trigger="click">
                  <div :class="{success:scope.row.transportation==='truck',warning:scope.row.transportation==='ship'}" style="font-size:13px">
                    {{scope.row.transportation==='truck'?'车':'船'}}<i class="el-icon-caret-bottom"></i>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="dropdownItem in json2arr(field.Logistics.transportation.option)" :key="dropdownItem._id||dropdownItem.value || dropdownItem.id" :command="dropdownItem.value">{{dropdownItem.name || dropdownItem.label}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <common-select style="margin-left:10px" size="mini" border :type="scope.row.transportation" :data.sync="scope.row[scope.row.transportation]"></common-select>
              </div>
              <my-form-item v-if="scope.prop==='loading'" number v-model="scope.row.loading" size="mini" :min="0" :max="order.count">
              </my-form-item>
              <my-form-item v-if="scope.prop==='landed'" number v-model="scope.row.landed" size="mini" :max="scope.row.loading" :min="0">
              </my-form-item>
              <my-form-item v-if="scope.prop==='price'" number v-model="scope.row.price" size="mini" :min="0">
              </my-form-item>
              <div v-if="scope.prop==='total'">
                {{Number(scope.row.price) * Number(scope.row.landed)}}
              </div>
              <my-form-item v-if="scope.prop==='state'" select size="mini" v-model="scope.row.state" :options="field.Logistics.state.option">
              </my-form-item>
            </div>
          </my-table>
          <div class="flex ac bob bor bol brbl brbr" style="font-size:13px;color:#909399;padding:10px 0;background:#f4f4f5">
            <div class="tc" style="width:120px">
              订单数量：<span style="color:#409EFF">{{order.count}}</span>
            </div>
            <div class="f1"></div>
            <div class="tc" style="width:120px">
              总装货量：<span style="color:#67C23A">{{statistics.loading}}</span>
            </div>
            <div class="tc" style="width:120px">
              总卸货量：<span style="color:#F56C6C">{{statistics.landed}}</span>
            </div>
            <div class="tc" style="width:120px">
              平均运费：<span style="color:#E6A23C">{{statistics.average}}</span>
            </div>
            <div class="tc" style="width:120px">
              总运费：<span style="color:#E6A23C">{{statistics.totalPrice}}</span>
              <!-- <span style="color:#aaa">（卸货量*单价）</span> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
import { logistics } from "./field";
import TransportTrainsCard from "./TransportTrainsCard";
export default {
  components: {
    TransportTrainsCard
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
            res.loading += logisticsItem.loading;
            res.landed += logisticsItem.landed;
            res.totalPrice += logisticsItem.price;
          });
        }
      });
      if (res.count > 0) {
        res.average = (res.totalPrice / res.count).toFixed(1);
      }
      return res;
    },
    totalLoading() {
      return 0;
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
      thead: JSON.parse(JSON.stringify(logistics)),
      showIndex: 1
    };
  },
  methods: {
    changeShowIndex(index) {
      if (index !== 0) {
        this.showIndex = index;
      }
    },
    add() {
      if (!this.trains[this.trains.length - 1 - 1].area._id) {
        this.$message.error(`请先选择中转地${this.trains.length - 1 - 1}地址`);
        return;
      }
      this.trains.splice(this.trains.length - 1, 0, {
        areaType: 0,
        type: 1,
        area: {},
        company: {},
        logistics: []
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
    },
    addLogistics(logistics, index) {
      if (!this.trains[index].area._id) {
        this.$message.error(`请先选择中转地${index}地址`);
        return;
      }
      if (
        logistics[logistics.length - 1] &&
        Number(logistics[logistics.length - 1].loading) <= 0
      ) {
        this.$message.error(`运单装货量必须大于0`);
        return;
      }
      logistics.push({
        loading: 0,
        landed: 0,
        price: 0,
        state: 0,
        transportation: "truck",
        truck: {},
        ship: {}
      });
    },
    removeLogistics(logistics, index) {
      logistics.splice(index, 1);
    },
    handleCommand(val, item) {
      item.transportation = val;
    }
  },
  created() {
    if (this.val.length === 0) {
      this.trains.push({
        type: 0,
        area: this.order.handle && this.order.handle.area,
        company: this.order.handle
      });
      this.trains.push({
        type: 2,
        area: this.order.area,
        logistics: [],
        [this.order.type]: this.order[this.order.type]
      });
    } else {
    }
  }
};
</script>

<style scoped>
</style>