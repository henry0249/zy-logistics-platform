<template>
  <loading-box class="g-transport-trains">
    <div v-for="(trainsItem,index) in transportTrains" :key="index" style="margin-bottom:15px">
      <div class="flex ac" style="border:1px solid #eee;border-bottom:1px dashed #ddd;">
        <div class="trains-title">
          物流链{{index+1}}
          <i @click="transportTrainsRemove(trainsItem,index)" v-if="index===transportTrains.length-1 && index!==0" style="color:#F56C6C" class="el-icon-delete pointer"></i>
        </div>
        <div v-if="index===0" class="border-right border-left" style="padding:10px;font-size:12px;color:#606266">
          出发地
        </div>
        <div v-if="index===0" class="tf1 f1" style="width:30%;padding:0 10px;font-size:12px;color:#606266">
          {{area2name(trainsItem.origin)}}
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
        <div v-if="index===transportTrains.length-1" class="tf1 f1"  style="width:30%;padding:0 10px;font-size:12px;color:#606266">
          {{area2name(trainsItem.destination)}}
        </div>
        <div class="tc" style="width:45px;border-left:1px solid #eee;padding:10px 0">
          <!-- <i style="color:#67C23A" class="el-icon-plus pointer"></i> -->
          <icon size="20" @click.native="transportTrainsAdd(trainsItem,index)" v-if="index === transportTrains.length-1"  color="#42a5f5" class="pointer">icon-zengjiahang</icon>
          <i @click="transportTrainsRemove(trainsItem,index)" v-else style="color:#F56C6C" class="el-icon-delete pointer"></i>
        </div>
      </div>
      <my-table opWidth="45" size="mini" index border edit op :thead="thead" :data.sync="trainsItem.data">
        <div class="tc" slot="op" slot-scope="scope">
          <icon size="13" @click.native="logisticsAdd(scope,trainsItem)" v-if="scope.index === trainsItem.data.length-1" style="color:#67C23A;margin-top:2px" class="pointer">icon-tianjiawuliu</icon>
          <!-- <i @click="logisticsAdd(scope,trainsItem)" v-if="scope.index === trainsItem.data.length-1" style="color:#67C23A" class="el-icon-plus pointer"></i> -->
          <i v-else style="color:#F56C6C" class="el-icon-minus pointer"></i>
        </div>
        <template slot-scope="scope">
          <my-form-item v-if="scope.prop==='startAt'" datetime size="mini" v-model="scope.row.startAt">
          </my-form-item>
          <my-form-item v-if="scope.prop==='finishAt'" datetime size="mini" v-model="scope.row.finishAt">
          </my-form-item>
          <my-form-item v-if="scope.prop==='state'" select size="mini" v-model="scope.row.state" :options="field.Logistics.state.option">
          </my-form-item>
        </template>
      </my-table>
    </div>
  </loading-box>
</template>

<script>
import { logistics } from "./field";
export default {
  props: {
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
    }
  },
  data() {
    return {
      transportTrains: [],
      thead: logistics
    };
  },
  watch: {
    transportTrains: {
      handler: function(val) {
        this.$emit("update:data", val);
      },
      deep: true
    },
    "order.area"(val, old) {
      console.log(val);
    }
  },
  methods: {
    field2data(obj) {
      let data = {};
      for (const key in obj) {
        data[key] = "";
      }
      return data;
    },
    transportTrainsAdd(item, index) {
      let pushItem = {
        origin: "",
        transfer: "",
        transfer2: "",
        destination: "",
        data: [this.field2data(this.thead)]
      };
      if (index === 0) {
        if (!item.origin) {
          this.$message.warn(`物流链${index + 1}未填写出发地`);
          return;
        }
        pushItem.destination = item.destination;
        item.destination = "";
      } else if (index === this.transportTrains.length - 1) {
        if (!item.transfer || item.transfer.length === 0) {
          this.$message.warn(`物流链${index + 1}未填写中转地`);
          return;
        }
        if (
          this.transportTrains[index - 1].transfer &&
          this.transportTrains[index - 1].transfer2
        ) {
          let transfer = this.transportTrains[index - 1].transfer;
          let transfer2 = this.transportTrains[index - 1].transfer2;
          console.log(transfer);
          console.log(transfer2);
          if (
            transfer[transfer.length - 1] === transfer2[transfer2.length - 1]
          ) {
            this.$message.warn(`物流链${index}中转地不能相同`);
            return;
          }
        }
        pushItem.destination = item.destination;
        item.destination = "";
      }
      this.transportTrains.push(pushItem);
    },
    transportTrainsRemove(item, index) {
      if (index === 0) {
        this.transportTrains[index + 1].origin = item.origin;
        this.transportTrains[index + 1].transfer = "";
        this.transportTrains[index + 1].transfer2 = "";
      } else if (index === this.transportTrains.length - 1) {
        this.transportTrains[index - 1].destination = item.destination;
        this.transportTrains[index - 1].transfer = "";
        this.transportTrains[index - 1].transfer2 = "";
      } else {
        if (index - 1 === 0) {
          this.transportTrains[index - 1].transfer2 = "";
          this.transportTrains[index + 1].transfer2 = "";
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
      if (item.unitPrice) {
        pushItem.unitPrice = item.unitPrice;
      }
      trainsItem.data.push(pushItem);
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
    }
  },
  created() {
    let dataItem = {
      ...this.field2data(this.thead)
    };
    console.log(this.goods);
    if (this.goods.transportPrice) {
      dataItem.transportPrice = this.goods.transportPrice;
    }
    if (this.goods.count) {
      dataItem.stockOutCount = this.goods.count;
      dataItem.receiptCount = this.goods.count;
    }
    let pushItem = {
      origin: this.goods.value.mfrs.area,
      transfer: "",
      transfer2: "",
      destination: this.order.area,
      data: [
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
.trains-input {
  border: none;
  outline: none;
  padding: 10px 10px;
  border-bottom: 1px solid #64b5f6;
  box-sizing: border-box;
}
</style>