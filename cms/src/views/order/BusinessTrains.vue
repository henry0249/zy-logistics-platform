<template>
  <div class="g-business-trains">
    <div v-if="goods.value" class="flex ac jb" style="color:#909399;padding-left:20px;background:#F2F6FC;font-size:13px">
      <div class="goods-info-padding">商品名称：{{goods.value.name}}</div>
      <div class="goods-info-padding">品牌：{{goods.value.brand.name}}</div>
      <div class="goods-info-padding">规格：{{goods.value.spec}}</div>
      <div class="goods-info-padding">单位：{{goods.value.unit}}</div>
      <div class="f1"></div>
      <div class="tc bol" style="width:45px;padding:8px 0">
        <i @click="add" style="color:#67C23A" class="el-icon-plus pointer"></i>
      </div>
      <!-- <div v-if="goods.value.freeDelivery" style="color:#67C23A">包配送</div>
      <div v-if="!goods.value.freeDelivery" style="color:#F56C6C">不包配送</div> -->
    </div>
    <div v-if="order.type || order._id">
      <div v-for="(item,index) in data" :key="index">
        <div class="flex ac goods-title" v-if="goods.value">
          <div class="bor tc" style="padding:8px 0;width:50px;color:#409EFF">
            # {{index+1}}
          </div>
          <div class="tc bor t-bg" style="width:100px;padding:8px 0">
            {{index === 0 ? '生产厂商' : '联营商'}}
          </div>
          <div v-if="index === 0" class="f1" style="padding:8px 10px">
            {{goods.value.mfrs.name}}
          </div>
          <div v-if="index > 0" class="f1" style="padding:0px 10px">
            <common-select type="company" border @change="associate1change($event,index)" title="选择联营商" :data.sync="item.associate"></common-select>
          </div>
          <div class="tc bor bol t-bg" style="width:100px;padding:8px 0">
            {{index === data.length-1 ? '收货客户' : '联营商'}}
          </div>
          <div v-if="index === data.length-1" class="f1" style="padding:5px 10px">
            <span v-if="order.type==='company'">{{order.company?order.company.name:'未选择下单公司'}}</span>
            <span v-else-if="order.type==='user'">{{order.user?order.user.name:'未选择下单用户'}}</span>
            <span v-else>未知类型订单</span>
          </div>
          <div v-if="index === 0 && data.length>1" class="f1" style="padding:0px 10px">
            <common-select type="company" border @change="associate1change($event,index)" title="选择联营商" :data.sync="item.associate"></common-select>
          </div>
          <div v-if="index > 0 && index !== data.length-1" class="f1" style="padding:0px 10px">
            <common-select type="company" border @change="associate2change($event,index)" title="选择联营商" :data.sync="item.associate2"></common-select>
          </div>
          <!-- <div class="tc bol" style="width:45px;padding:8px 0">
            <i @click="add(item,index)" style="color:#67C23A" class="el-icon-plus pointer"></i>
          </div> -->
        </div>
        <my-table opWidth="45" size="mini" border edit op :thead="thead" :data.sync="item.info">
          <div class="tc" slot="op" slot-scope="scope">
            <i @click="remove(item,index)" style="color:#F56C6C" class="el-icon-delete pointer"></i>
          </div>
        </my-table>
      </div>
    </div>
    <div class="tc" style="color:#ccc;padding:10px 0" v-else>
      订单信息未完善
    </div>
  </div>
</template>

<script>
import { businessTrains } from "./field";
export default {
  props: {
    goods: {
      type: Object,
      default() {
        return {};
      }
    },
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
    }
  },
  data() {
    return {
      thead: businessTrains,
      data: []
    };
  },
  methods: {
    add() {
      this.pushItem();
    },
    remove(item, index) {
      if (this.data.length === 1) {
        this.$message.warn(`至少保留一条贸易链`);
        return;
      }
      this.data.splice(index, 1);
    },
    pushItem() {
      this.data.push({
        goods: this.goods._id,
        order: this.order._id,
        info: [
          {
            purchasePrice: this.goods.unitPrice,
            purchaseCount: this.goods.count,
            sellPrice: 0,
            sellCount: 0,
            totalPrice: 0,
            remark: "",
            associate: "",
            associate2: ""
          }
        ]
      });
    },
    associate1change(val, index) {
      if (index - 1 > 0) {
        this.data[index - 1].associate = val;
        this.data.splice(index, 1, this.data[index - 1]);
      } else {
        this.data[index + 1].associate = val;
        this.data.splice(index, 1, this.data[index + 1]);
      }
    },
    associate2change(val, index) {
      console.log(val, index);
    },
    save() {
      console.log(this.data);
    }
  },
  created() {
    if (this.val.length > 0) {
      this.data = JSON.parse(JSON.stringify(this.val));
    } else {
      this.pushItem();
    }
  }
};
</script>

<style scoped>
.goods-title {
  font-size: 12px;
  border: 1px solid #eee;
  border-bottom: 1px dashed #67c23a;
  border-top: 2px solid #67c23a;
  color: #606266;
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
.goods-info-padding {
  width: 20%;
}
.t-bg {
  background: #f2f6fc;
}
</style>