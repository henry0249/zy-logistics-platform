<template>
  <loading-box v-model="loadingText">
    <div class="g-business-trains">
      <div class="flex ac jb" style="color:#909399;padding-left:25px;background:#f4f4f5;font-size:13px;margin:15px 0;border-radius:4px">
        <div style="margin-right:20px">贸易链</div>
        <!-- <div v-if="data.length > 0 " style="margin-right:15px">
          <remove-check label="清空" @remove="removeAll"></remove-check>
        </div> -->
        <div>{{titleTip}}</div>
        <div class="f1"></div>
        <div v-if="order.goods && order.goods._id" class="flex ac jb">
          <div style="width:150px">商品名称：{{order.goods.name}}</div>
          <div class="goods-info-padding">品牌：{{order.goods.brand.name}}</div>
          <div class="goods-info-padding">规格：{{order.goods.spec}}</div>
          <div class="goods-info-padding">单位：{{order.goods.unit}}</div>
        </div>
        <div @click="add" class="success pointer" style="padding:10px">
          贸易节点<i class="el-icon-plus"></i>
        </div>
      </div>
      <div v-if="data.length>0" style="height:280px">
        <div class="hor-scroll" style="margin-bottom:10px">
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
  </loading-box>
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
    titleTip: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loadingText: "",
      data: [],
      temp: [{}]
    };
  },
  watch: {
    data: {
      handler: function(val) {
        this.$emit("update:data", val);
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
    async remove(item, index) {
      if (this.data.length > 2) {
        if (item.type === "customer") {
          this.$message.warn(`不能删除客户`);
          return;
        }
        if (item.type === "supplier") {
          this.$message.warn(`不能删除供应商`);
          return;
        }
        if (item._id) {
          this.loadingText = "加载中...";
          try {
            this.data.splice(index, 1);
          } catch (error) {}
          this.loadingText = "";
        } else {
          this.data.splice(index, 1);
        }
        if (this.data.length === 2) {
          // this.data = [];
        }
      } else {
        this.data = [];
      }
    },
    pushItem() {
      let body = {
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
          company: this.order.goods.company
        });
        // this.data.push({
        //   ...body,
        //   type: "pool",
        //   company: {}
        // });
        this.data.push({
          ...body,
          type: "customer",
          [this.order.type]: this.order[this.order.type],
          customerType: this.order.type
        });
      } else {
        if (!(this.data[this.data.length - 1 - 1].company._id)) {
          this.$message.warn(`请先选择联营商公司`);
          return;
        }
        this.data.splice(this.data.length - 1, 0, {
          ...body,
          type: "pool",
          company: {},
          supplyCount: this.data[this.data.length - 1 - 1].supplyCount,
          supplyPrice: this.data[this.data.length - 1 - 1].supplyPrice
        });
      }
    },
    removeAll() {
      this.data = [];
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