<template>
  <loading-box class="g-transport-trains">
    <el-tabs type="border-card" style="box-shadow:none">
      <el-tab-pane :label="item.value.name " v-for="item in goods" :key="item._id">
        <div v-for="(trainsItem,index) in transportTrains" :key="index" style="margin-bottom:15px">
          <div class="flex ac" style="border:1px solid #eee;border-bottom:none;">
            <div class="trains-title">
              物流链{{index+1}}
              <i @click="transportTrainsRemove(trainsItem,index)" v-if="index===transportTrains.length-1 && index!==0" style="color:#F56C6C" class="el-icon-delete pointer"></i>
            </div>
            <div class="f1"></div>
            <my-form-item v-if="index==0" area style="width:25%;padding:0 10px" size="mini" v-model="trainsItem.origin" :show-all-levels="false" label="出发地">
            </my-form-item>
            <my-form-item :key="index+'transfer1'" v-if="transportTrains.length>1" transfer style="width:25%;padding:0 10px" size="mini" v-model="trainsItem.transfer" label="中转地1" @change="transferChange($event, index)">
            </my-form-item>
            <my-form-item :key="index+'transfer2'" v-if="transportTrains.length>1 && index>0 && index !== transportTrains.length-1" transfer style="width:25%;padding:0 10px" size="mini" v-model="trainsItem.transfer2" label="中转地2" @change="transfer2Change($event, index)">
            </my-form-item>
            <my-form-item v-if="index===transportTrains.length-1" area style="width:25%;padding:0 10px" size="mini" v-model="trainsItem.destination" :show-all-levels="false" disabled label="目的地">
            </my-form-item>
            <div class="tc" style="width:45px;border-left:1px solid #eee;padding:10px 0">
              <i @click="transportTrainsAdd(trainsItem,index)" v-if="index === transportTrains.length-1" style="color:#67C23A" class="el-icon-plus pointer"></i>
              <i @click="transportTrainsRemove(trainsItem,index)" v-else style="color:#F56C6C" class="el-icon-delete pointer"></i>
            </div>
          </div>
          <my-table opWidth="45" size="mini" index border edit op :thead="thead" :data.sync="trainsItem.data">
            <div class="tc" slot="op" slot-scope="scope">
              <i @click="logisticsAdd(scope,trainsItem)" v-if="scope.index === trainsItem.data.length-1" style="color:#67C23A" class="el-icon-plus pointer"></i>
              <i v-else style="color:#F56C6C" class="el-icon-delete pointer"></i>
            </div>
          </my-table>
        </div>
      </el-tab-pane>
    </el-tabs>
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
    }
  },
  data() {
    return {
      transportTrains: [],
      thead: logistics,
      goods: []
    };
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
        origin: [],
        transfer: "",
        transfer2: "",
        destination: [],
        data: [this.field2data(this.thead)]
      };
      if (index === 0) {
        if (item.origin.length === 0) {
          this.$message.warn(`物流链${index + 1}未填写出发地`);
          return;
        }
        pushItem.destination = [...item.destination];
        item.destination = [];
      } else if (index === this.transportTrains.length - 1) {
        if (!item.transfer) {
          this.$message.warn(`物流链${index + 1}未填写中转地`);
          return;
        }
        if (
          this.transportTrains[index - 1].transfer &&
          this.transportTrains[index - 1].transfer2
        ) {
          if (
            this.transportTrains[index - 1].transfer ===
            this.transportTrains[index - 1].transfer2
          ) {
            this.$message.warn(`物流链${index}中转地不能相同`);
            return;
          }
        }
        pushItem.destination = [...item.destination];
        item.destination = [];
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
      trainsItem.data.push(item);
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
    this.transportTrains.push({
      origin: [],
      transfer: "",
      transfer2: "",
      destination: this.area2arr(this.order.area),
      data: [
        {
          ...this.field2data(this.thead)
        }
      ]
    });
    console.log(this.transportTrains);
    if (this.order.goods) {
      this.goods = JSON.parse(JSON.stringify(this.order.goods));
    }
  }
};
</script>

<style scoped>
.g-transport-trains {
  color: #333;
}
.trains-title {
  padding: 10px 10px;
  border-right: 1px solid #eee;
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