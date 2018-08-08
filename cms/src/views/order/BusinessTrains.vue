<template>
  <div class="g-business-trains">
    <div class="flex ac jb" style="color:#909399;padding-left:25px;background:#F2F6FC;font-size:13px;margin:15px 0;border-radius:4px">
      <div class="f1" style="margin-right:20px">贸易链</div>
      <div v-if="order.goods && order.goods._id" class="flex ac jb">
        <div style="width:150px">商品名称：{{order.goods.name}}</div>
        <div class="goods-info-padding">品牌：{{order.goods.brand.name}}</div>
        <div class="goods-info-padding">规格：{{order.goods.spec}}</div>
        <div class="goods-info-padding">单位：{{order.goods.unit}}</div>
      </div>
      <div class="tc bol" style="width:46px;padding:10px 0">
        <i @click="add" style="color:#67C23A" class="el-icon-plus pointer"></i>
      </div>
    </div>
    <div style="height:280px" v-if="data.length>0">
      <div class="hor-scroll">
        <div class="hor-scroll-item" style="padding:10px 0" v-for="(item,index) in data" :key="index">
          <div class="flex ac">
            <business-trains-card :order="order" :index="index" :last.sync="index>0?data[index-1]:undefined" :next.sync="data[index+1]?data[index+1]:undefined" :title="businessTrainsTitle(index)" :data.sync="item" @remove="remove($event,index)"></business-trains-card>
            <div v-if="index!==data.length-1" style="padding:0 10px">
              <i class="el-icon-d-arrow-right success"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { businessTrains } from "./field";
import BusinessTrainsCard from "./BusinessTrainsCard";
export default {
  components: {
    BusinessTrainsCard
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
    thead: {
      type: Object,
      default() {
        return businessTrains;
      }
    },
    // data: {
    //   type: Array,
    //   default() {
    //     return [];
    //   }
    // },
    removelist: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      data: [],
      temp: [{}],
      removeData: []
    };
  },
  watch: {
    removeData(val) {
      this.$emit("update:removelist", val);
    },
    data: {
      handler: function(val) {
        let temp = JSON.parse(JSON.stringify(val));
        let res = [];
        temp.forEach((item, index) => {
          let pushItem = {
            type: this.trainsType(index),
            ...item,
            customerType: this.order.type,
            mfrs: this.order.mfrs._id
          };
          delete pushItem.user;
          delete pushItem.company;
          pushItem[this.order.type] = this.order[this.order.type]._id;
          if (pushItem.type === 0) {
            delete pushItem.fromCompany;
            delete pushItem.toCompany;
          }
          if (pushItem.type === 1) {
            delete pushItem.fromCompany;
            pushItem.toCompany = item.toCompany._id;
          }
          if (pushItem.type === 2) {
            pushItem.fromCompany = item.fromCompany._id;
            pushItem.toCompany = item.toCompany._id;
          }
          if (pushItem.type === 3) {
            delete pushItem.toCompany;
            pushItem.fromCompany = item.fromCompany._id;
          }
          res.push(pushItem);
        });
        this.$emit("update:data", res);
      },
      deep: true
    }
  },
  methods: {
    businessTrainsTitle(index) {
      if (index === 0) {
        return "供货商";
      } else if (index === this.data.length - 1) {
        return "客户";
      } else {
        return "联营商" + index;
      }
    },
    trainsType(index) {
      let length = this.data.length;
      if (length === 1) {
        return 0;
      }
      if (length === 2) {
        if (index === 0) {
          return 1;
        }
        return 3;
      }
      if (length > 2) {
        if (index === 0) {
          return 1;
        }
        if (index === length - 1) {
          return 3;
        }
        return 2;
      }
    },
    add() {
      if (!(this.order[this.order.type] && this.order[this.order.type]._id)) {
        this.$message.warn(`请先选择客户`);
        return;
      }
      if (!(this.order.goods && this.order.goods._id)) {
        this.$message.warn(`请先选择商品`);
        return;
      }
      if (Number(this.order.count) <= 0) {
        this.$message.warn(`商品数量必须大于0`);
        return;
      }
      this.pushItem();
    },
    remove(item, index) {
      if (this.data.length > 2) {
        if (item.type === "customer") {
          this.$message.warn(`不能删除客户`);
          return;
        }
        if (item.type === "supplier") {
          this.$message.warn(`不能删除供应商`);
          return;
        }
        this.data.splice(index, 1);
        if (item._id) {
          this.removeData.push(item._id);
        }
      } else {
        this.data = [];
      }
    },
    pushItem() {
      let body = {
        company: {},
        supplyPrice: this.order.sell,
        supplyCount: this.order.count,
        loss: 0,
        receive: this.order.count,
        remark: ""
      };
      if (this.data.length === 0) {
        this.data.push({
          ...body,
          type: "supplier",
          company: this.order.goods.mfrs
        });
        this.data.push({
          ...body,
          type: "pool"
        });
        this.data.push({
          ...body,
          type: "customer",
          [this.order.type]: this.order[this.order.type],
          customerType: this.order.type
        });
      } else {
        this.data.splice(this.data.length - 1, 0, {
          ...body,
          type: "pool",
          supplyCount: this.data[this.data.length - 1 - 1].supplyCount,
          supplyPrice: this.data[this.data.length - 1 - 1].supplyPrice
        });
      }
    },
    fromCompanyChange(val, index) {
      this.data[index - 1].toCompany = val;
    },
    toCompanyChange(val, index) {
      this.data[index + 1].fromCompany = val;
    }
  },
  created() {
    if (this.val && this.val.length > 0) {
      this.data = JSON.parse(JSON.stringify(this.val));
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
  /* width: 30%; */
  width: 120px;
  text-align: center;
}
.t-bg {
  background: #f2f6fc;
}
.trains-tip {
  font-size: 12px;
  color: #606266;
}
.tip-text {
  color: #f56c6c;
  font-weight: 600;
}
</style>