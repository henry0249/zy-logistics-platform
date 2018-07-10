<template>
  <loading-box class="g-transport-trains" v-model="loadingText">
    <div v-for="(trainsItem,index) in transportTrains" :key="index" style="margin-bottom:15px">
      <div class="flex ac" style="border:1px solid #eee;border-bottom:1px dashed #E6A23C;border-top:2px solid #E6A23C;">
        <div class="trains-title">
          #{{index+1}}&nbsp;物流链
          <!-- <i @click="transportTrainsRemove(trainsItem,index)" v-if="index===transportTrains.length-1 && index!==0" style="color:#F56C6C" class="el-icon-delete pointer"></i> -->
        </div>
        <div v-if="index===0" class="border-right border-left" style="padding:10px;font-size:12px;color:#606266">
          出发地
        </div>
        <div v-if="index===0" class="tf1 f1" style="width:30%;padding:0 10px;font-size:12px;color:#606266">
          {{area2name(goods.value.mfrs.area)}}
        </div>
        <div v-if="transportTrains.length>1" class="border-right border-left" style="padding:10px;font-size:12px;color:#606266">
          中转地
        </div>
        <div class="f1" style="padding:0 10px" v-if="transportTrains.length>1">
          <my-form-item :key="index+'transfer1'" transfer size="mini" v-model="trainsItem.transfer" @change="transferChange($event, index)">
          </my-form-item>
        </div>
        <div v-if="transportTrains.length>1 && index>0 && index !== transportTrains.length-1" class="border-right border-left" style="padding:10px;font-size:12px;color:#606266">
          中转地
        </div>
        <div class="f1" style="padding:0 10px" v-if="transportTrains.length>1 && index>0 && index !== transportTrains.length-1">
          <my-form-item :key="index+'transfer2'" transfer size="mini" v-model="trainsItem.transfer2" @change="transfer2Change($event, index)">
          </my-form-item>
        </div>
        <div v-if="index===transportTrains.length-1" class="border-right border-left" style="padding:10px;font-size:12px;color:#606266">
          目的地
        </div>
        <div v-if="index===transportTrains.length-1" class="tf1 f1" style="width:30%;padding:0 10px;font-size:12px;color:#606266">
          {{area2name(order.area)}}
        </div>
        <div class="tc" style="width:45px;border-left:1px solid #eee;padding:10px 0" v-if="!disabled">
          <el-dropdown v-if="index === transportTrains.length-1">
            <span>
              <icon size="20" @click.native="transportTrainsAdd(trainsItem,index)" color="#42a5f5" class="pointer">icon-zengjiahang</icon>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  style="color:#F56C6C;font-size:12px" @click.native="transportTrainsRemove(trainsItem,index)">删除此链</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <i @click="transportTrainsRemove(trainsItem,index)" v-else style="color:#F56C6C" class="el-icon-delete pointer"></i>
        </div>
      </div>
      <my-table opWidth="45" size="mini" index border :edit="disabled?undefined:true" :op="disabled?undefined:true" :thead="thead" :data.sync="trainsItem.logistics">
        <div class="tc" slot="op" slot-scope="scope">
          <el-dropdown  v-if="scope.index === trainsItem.logistics.length-1">
            <icon size="13" @click.native="logisticsAdd(scope,trainsItem)" v-if="scope.index === trainsItem.logistics.length-1" style="color:#67C23A;margin-top:2px" class="pointer">icon-tianjiawuliu</icon>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item  style="color:#F56C6C;font-size:12px" @click.native="logisticsRemove(scope,trainsItem)">删除此运单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <i @click="logisticsRemove(scope,trainsItem)" v-else style="color:#F56C6C" class="el-icon-minus pointer"></i>
        </div>
        <template slot-scope="scope" style="background:red">
          <span v-if="scope.prop==='no'">
            <span v-if="scope.row.no">{{scope.row.no}}</span>
            <span v-else>-</span>
          </span>
          <my-form-item :edit="!disabled" v-if="scope.prop==='ts' && !loadingText" cascader  v-model="scope.row.ts" @change="tsChange($event,scope.row)" :options="truckAndShipCascader" :props="{value:'_id',label:'no'}" :show-all-levels="false" clearable size="mini">
          </my-form-item>
          <my-form-item :edit="!disabled" v-if="scope.prop==='startAt'" datetime size="mini" v-model="scope.row.startAt" format="MM-dd HH:mm">
          </my-form-item>
          <my-form-item :edit="!disabled" v-if="scope.prop==='finishAt'" datetime size="mini" v-model="scope.row.finishAt" format="MM-dd HH:mm">
          </my-form-item>
          <my-form-item :edit="!disabled" v-if="scope.prop==='state'" select size="mini" v-model="scope.row.state" :options="field.Logistics.state.option">
          </my-form-item>
        </template>
      </my-table>
      <div class="flex ac bob bor bol" style="font-size:13px;color:#606266;padding:8px 0;background:#FAFAFA">
        <div class="tc" style="width:150px">
          剩余分配装货量：<span style="color:#F56C6C">{{count(trainsItem.logistics).less}}</span>
        </div>
        <div class="f1"></div>
        <div class="tc" style="width:120px">
          订货数量：<span style="color:#409EFF">{{goods.count}}</span>
        </div>
        <div class="tc" style="width:120px">
          总装货量：<span style="color:#67C23A">{{count(trainsItem.logistics).totalLoding}}</span>
        </div>
        <div class="tc" style="width:120px">
          总卸货量：<span style="color:#E6A23C">{{count(trainsItem.logistics).totalLanded}}</span>
        </div>
        <div class="tc" style="width:240px">
          总运费：<span style="color:#F56C6C">{{count(trainsItem.logistics).totalPrice}}</span>
          <span style="color:#aaa">（卸货量*单价）</span>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
import { logistics } from "./field";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    order: {
      type: Object,
      default() {
        return {};
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    goods: {
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
    removeTrains: {
      type: Array,
      default() {
        return [];
      }
    },
    removeLogistics: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      loadingText: "加载中...",
      transportTrains: [],
      thead: JSON.parse(JSON.stringify(logistics)),
      truckAndShipCascader: []
    };
  },
  watch: {
    transportTrains: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    }
  },
  methods: {
    tsChange(val, item) {
      delete item.truck;
      delete item.ship;
      item[val[1]] = val[2];
    },
    count(data = []) {
      let res = {
        less: this.goods.count || 0,
        totalLoding: 0,
        totalLanded: 0,
        totalPrice: 0
      };
      data.forEach(lItem => {
        if (Number(lItem.loading) > 0) {
          res.totalLoding += Number(lItem.loading);
        }
        if (Number(lItem.landed) > 0) {
          res.totalLanded += Number(lItem.landed);
        }
        if (Number(lItem.transportPrice) > 0 && Number(lItem.landed) > 0) {
          res.totalPrice += Number(lItem.landed) * Number(lItem.transportPrice);
        }
      });
      res.less = this.goods.count - res.totalLoding;
      return res;
    },
    field2data(obj) {
      let data = {};
      for (const key in obj) {
        data[key] = "";
      }
      data.loading = 0;
      data.landed = 0;
      data.state = 0;
      data.ts = [];
      data.goods = this.goods.value._id;
      data.order = this.order._id;
      data.transportPrice = this.goods.transportPrice;
      if (this.order.company) {
        data.company = this.order.company._id;
      }
      if (this.order.user) {
        data.user = this.order.user._id;
      }
      data.contactName = this.order.contactName;
      data.contactNumber = this.order.contactNumber;
      data.area = this.order.area._id;
      data.address = this.order.address;
      return data;
    },
    transportTrainsAdd(item, index) {
      let pushItem = {
        origin: "",
        transfer: [],
        transfer2: [],
        destination: "",
        logistics: [
          {
            ...this.field2data(this.thead)
          }
        ],
        goods: this.goods.value._id,
        order: this.order._id
      };
      if (index === 0) {
        if (!item.origin) {
          this.$message.warn(`物流链${index + 1}未填写出发地`);
          return;
        }
      } else if (index === this.transportTrains.length - 1) {
        if (!item.transfer || item.transfer.length === 0) {
          this.$message.warn(`物流链${index + 1}未填写中转地`);
          return;
        }
        if (
          this.transportTrains[index - 1].transfer &&
          this.transportTrains[index - 1].transfer2
        ) {
          let transfer = this.transportTrains[index - 1].transfer || [];
          let transfer2 = this.transportTrains[index - 1].transfer2 || [];
          if (
            transfer[transfer.length - 1] === transfer2[transfer2.length - 1]
          ) {
            this.$message.warn(`物流链${index}中转地不能相同`);
            return;
          }
        }
      }
      this.transportTrains.push(pushItem);
    },
    transportTrainsRemove(item, index, check = true) {
      if (this.transportTrains.length === 1) {
        this.$message.warn(`至少保留一条物流链`);
        return;
      }
      if (item._id) {
        this.removeTrains.push(item);
        item.logistics.forEach(logisticsItem => {
          if (logisticsItem._id) {
            this.removeLogistics.push(logisticsItem);
          }
        });
      }
      if (index === 0) {
        this.transportTrains[index + 1].transfer = [];
        this.transportTrains[index + 1].transfer2 = [];
      } else if (index === this.transportTrains.length - 1) {
        this.transportTrains[index - 1].transfer = [];
        this.transportTrains[index - 1].transfer2 = [];
      } else {
        if (index - 1 === 0) {
          this.transportTrains[index - 1].transfer2 = [];
          this.transportTrains[index + 1].transfer2 = [];
          this.transportTrains[index + 1].transfer = this.transportTrains[
            index - 1
          ].transfer;
        } else {
          this.transportTrains[index + 1].transfer = this.transportTrains[
            index - 1
          ].transfer2;
        }
      }
      this.transportTrains.splice(index, 1);
    },
    logisticsAdd(scope, trainsItem) {
      let item = scope.row;
      let pushItem = {
        ...this.field2data(this.thead)
      };
      if (item.transportPrice) {
        pushItem.transportPrice = item.transportPrice;
      }
      trainsItem.logistics.push(pushItem);
    },
    logisticsRemove(scope, trainsItem) {
      if (trainsItem.logistics.length === 1) {
        this.$message.warn(`至少保留一条运单`);
        return;
      }
      if (scope.row._id) {
        this.removeLogistics.push(scope.row);
      }
      trainsItem.logistics.splice(scope.index, 1);
    },
    transferChange(val, index) {
      if (index === 0) {
        this.transportTrains[index + 1].transfer = val;
      } else {
        if (index - 1 > 0) {
          this.transportTrains[index - 1].transfer2 = val;
        } else {
          this.transportTrains[index - 1].transfer = val;
        }
      }
    },
    transfer2Change(val, index) {
      this.transportTrains[index + 1].transfer = val;
    },
    initLogistics() {
      if (this.val && this.val instanceof Array && this.val.length > 0) {
        this.transportTrains = this.val;
        this.transportTrains.forEach(item => {
          if (item.transfer) {
            let transfer = this.area2arr(item.transfer.area);
            transfer[transfer.length - 1] = item.transfer._id;
            item.transfer = transfer;
          }
          if (item.transfer2) {
            let transfer2 = this.area2arr(item.transfer2.area);
            transfer2[transfer2.length - 1] = item.transfer2._id;
            item.transfer2 = transfer2;
          }
          item.logistics.forEach(litem => {
            if (litem.truck) {
              litem.ts = [litem.truck.company, "truck", litem.truck._id];
            }
            if (litem.ship) {
              litem.ts = [litem.ship.company, "ship", litem.ship._id];
            }
            litem.startAt = new Date(litem.startAt);
            litem.finishAt = new Date(litem.finishAt);
          });
        });
      } else {
        delete this.thead.no;
        this.transportTrains = [];
        let dataItem = {
          ...this.field2data(this.thead)
        };
        dataItem.transportPrice = this.goods.transportPrice;
        dataItem.goods = this.goods.value._id;
        let pushItem = {
          order: this.order._id,
          goods: this.goods.value._id,
          transfer: [],
          transfer2: [],
          logistics: [
            {
              ...dataItem
            }
          ]
        };
        if (this.goods.value.mfrs && this.goods.value.mfrs.area) {
          pushItem.origin = this.goods.value.mfrs.area;
        }
        if (this.order.area) {
          pushItem.destination = this.order.area;
        }
        this.transportTrains.push(pushItem);
      }
    },
    check() {
      let errText = "";
      this.transportTrains.forEach((item, index) => {
        let count = this.count(item.logistics);
        if (count.less < 0) {
          errText = `物流链${index + 1}总装货量不能大于订货数量`;
          return;
        }
        if (count.totalLanded > count.totalLoding) {
          errText = `物流链${index + 1}总卸货量不能大于总装货量`;
          return;
        }
        if (count.totalLoding <= 0) {
          errText = `物流链${index + 1}总装货量不能为0`;
          return;
        }
      });
      this.transportTrains.forEach((trains, trainsIndex) => {
        trains.logistics.forEach((item, index) => {
          if (item.state > 0 && item.ts.length === 0) {
            errText = `物流链${trainsIndex + 1}的第${index +
              1}除了发布状态的运单,车船信息不能为空`;
            return;
          }
          if (this.is("number", Number(item.loading))) {
            if (Number(item.loading) <= 0) {
              errText = `物流链${trainsIndex + 1}的第${index +
                1}张运单装货量必须大于0`;
            }
            return;
          } else {
            errText = `物流链${trainsIndex + 1}的第${index +
              1}张运单装货量必须为数字`;
            return;
          }
          if (!this.is("number", Number(item.landed))) {
            errText = `物流链${trainsIndex + 1}的第${index +
              1}张运单卸货量必须为数字`;
            return;
          }
          if (
            this.is("number", Number(item.landed)) &&
            this.is("number", Number(item.loading))
          ) {
            if (Number(item.loading) < Number(item.landed)) {
              errText = `物流链${trainsIndex + 1}的第${index +
                1}张运单卸货量不能大于装货量`;
            }
            return;
          }
        });
      });
      if (errText) {
        this.$confirm(errText, "物流链信息填写有误", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning",
          center: true
        });
        return false;
      }
      return true;
    }
  },
  async created() {
    this.loadingText = "加载中";
    this.initLogistics();
    try {
      this.truckAndShipCascader = await this.$ajax("/company/ts/cascader");
    } catch (error) {}
    this.loadingText = "";
  }
};
</script>

<style scoped>
.g-transport-trains {
  color: #333;
}
.trains-title {
  padding: 0px 10px;
  width: 100px;
  /* border-right: 1px solid #eee; */
  color: #42a5f5;
}
.border-right {
  border-right: 1px solid #eee;
}
.border-left {
  border-left: 1px solid #eee;
}
.bot {
  border-top: 1px solid #eee;
}
.bob {
  border-bottom: 1px solid #eee;
}
.bor {
  border-right: 1px solid #eee;
}
.bol {
  border-left: 1px solid #eee;
}
.trains-input {
  border: none;
  outline: none;
  padding: 10px 10px;
  border-bottom: 1px solid #64b5f6;
  box-sizing: border-box;
}
</style>