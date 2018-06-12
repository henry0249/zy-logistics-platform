<template>
  <loading-box class="g-transport-trains">
    <el-tabs type="border-card" style="box-shadow:none">
      <el-tab-pane :label="item.value.name " v-for="item in goods" :key="item._id">
        <div v-for="(trainsItem,index) in transportTrains" :key="index" style="margin-bottom:15px">
          <div class="flex ac" style="border:1px solid #eee;border-bottom:none;">
            <div class="trains-title">
              物流链{{index+1}}
            </div>
            <div class="f1"></div>
            <div class="border-right border-left" style="padding:5px 10px">
              出发地
            </div>
            <input v-model="trainsItem.origin" class="trains-input" type="text" />
            <div class="border-right border-left" style="padding:5px 10px">
              目的地
            </div>
            <input v-model="trainsItem.destination" class="trains-input" type="text" />
            <div class="tc" style="width:45px;border-left:1px solid #eee;padding:5px 0">
              <i @click="transportTrainsAdd(trainsItem,index)" v-if="index === transportTrains.length-1" style="color:#67C23A" class="el-icon-plus pointer"></i>
              <i @click="transportTrainsRemove(index)" v-else style="color:#F56C6C" class="el-icon-delete pointer"></i>
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
    transportTrainsAdd(item, index) {
      if (!item.origin) {
        this.$message.warn(`物流链${index + 1}未填写出发地`);
        return;
      }
      if (!item.destination) {
        this.$message.warn(`物流链${index + 1}未填写目的地`);
        return;
      }
      this.transportTrains.push({
        origin: item.destination,
        destination: "",
        data: [this.field2data(this.thead)]
      });
    },
    transportTrainsRemove(index) {
      this.transportTrains.splice(index, 1);
    },
    logisticsAdd(scope,trainsItem) {
      let item = scope.row;
      trainsItem.data.push(item);
    },
    field2data(obj) {
      let data = {};
      for (const key in obj) {
        data[key] = "";
      }
      return data;
    }
  },
  created() {
    this.transportTrains.push({
      origin: "",
      destination: "",
      data: [{ ...this.field2data(this.thead) }]
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
  padding: 5px 10px;
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
  padding: 5px 10px;
  border-bottom: 1px solid #64b5f6;
  box-sizing: border-box;
}
</style>