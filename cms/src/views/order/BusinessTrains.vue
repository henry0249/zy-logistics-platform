<template>
  <loading-box v-model="loadingText">
    <div class="g-business-trains">
      <div class="flex ac jb" style="color:#909399;padding-left:25px;background:#f4f4f5;font-size:13px;margin:15px 0;border-radius:4px">
        <div style="margin-right:20px">贸易链</div>
        <div>{{titleTip}}</div>
        <div class="f1"></div>
        <div v-if="order.goods && order.goods._id" class="flex ac jb">
          <div style="width:150px">商品名称：{{order.goods.name}}</div>
          <div class="goods-info-padding">品牌：{{order.goods.brand.name}}</div>
          <div class="goods-info-padding">规格：{{order.goods.spec}}</div>
          <div class="goods-info-padding">库存：{{order.goods.stock}} {{order.goods.unit}}</div>
        </div>
        <div @click="addToStart" class="warning pointer" style="padding:10px">
          源头供应商<i class="el-icon-plus"></i>
        </div>
        <div @click="add" class="success pointer" style="padding:10px">
          贸易节点<i class="el-icon-plus"></i>
        </div>
      </div>
      <div v-if="data.length>0" style="min-height:200px" :style="{height:height+'px'}">
        <div class="hor-scroll" v-getHeight="getHeight">
          <div class="hor-scroll-item" style="margin-bottom:10px" v-for="(item,index) in data" :key="item._id || item.template_id">
            <div class="flex ac">
              <business-trains-card :settle="settle" :order="order" :index="index" :last.sync="index>0?data[index-1]:undefined" :next.sync="data[index+1]?data[index+1]:undefined" :title="businessTrainsTitle(index)" :data.sync="item" @remove="remove($event,index)"></business-trains-card>
              <div class="tc" v-if="index!==data.length-1" style="width:50px">
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
//贸易链主导公司颜色标识
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
    },
    settle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: 0,
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
    getHeight(val) {
      this.height = val;
    },
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
    addToStart() {
      if (this.data.length === 0) {
        this.$message.warn(`物流链尚未添加`);
        return;
      }
      if (!this.data[0].company || !this.data[1].company) {
        this.$message.warn(`节点中有公司未选择`);
        return;
      }
      let data0 = this.data[0];
      data0.type = "pool";
      this.$set(this.data, 0, data0);
      this.data.unshift({
        type: "supplier",
        company: "",
        supplyPrice: this.data[0].supplyPrice,
        supplyCount: this.data[0].supplyCount,
        preBalancePrice: this.data[0].preBalancePrice,
        balanceCount: this.data[0].supplyCount,
        receive: 0,
        loss: 0,
        remark: "",
        logistics: [],
        template_id: new Date().getTime()
      });
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
      if (Number(this.order.sell) <= 0) {
        this.$message.warn(`商品售价必须大于0`);
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
        if (item._id) {
          this.loadingText = "加载中...";
          try {
            await this.$ajax.post("/businessTrains/delete", {
              _id: item._id
            });
            if (condition) {
            }

            this.data.splice(index, 1);
            if (this.data[0]._id) {
              await this.$ajax.post("/businessTrains/update", {
                find: { _id: item._id },
                update: { type: "supplier" }
              });
            }
          } catch (error) {}
          this.loadingText = "";
        } else {
          this.data.splice(index, 1);
        }
        this.data[0].type = "supplier";
        this.$set(this.data, 0, this.data[0]);
      } else {
        this.$message.warn(`贸易链至少两个节点`);
        return;
      }
    },
    pushItem() {
      let body = {
        supplyPrice: this.order.factory,
        supplyCount: this.order.count,
        preBalancePrice: this.order.sell,
        balanceCount: this.order.count,
        loss: 0,
        receive: this.order.count,
        remark: "",
        logistics: [],
      };
      if (this.data.length === 0) {
        this.data.push({
          ...body,
          type: "supplier",
          template_id: new Date().getTime(),
          company: this.order.goods.company
        });
        // this.data.push({
        //   ...body,
        //   type: "pool",
        //   company: {}
        // });
        this.data.push({
          ...body,
          template_id: new Date().getTime()+1,
          type: "customer",
          [this.order.type]: this.order[this.order.type],
          customerType: this.order.type
        });
      } else {
        if (!this.data[0].company) {
          this.$message.warn(`节点中有公司未选择`);
          return;
        }
        if (!this.data[this.data.length - 1 - 1].company) {
          this.$message.warn(`节点中有公司未选择`);
          return;
        }
        this.data.splice(this.data.length - 1, 0, {
          ...body,
          type: "pool",
          company: "",
          supplyPrice: this.data[this.data.length - 1 - 1].supplyPrice,
          supplyCount: this.data[this.data.length - 1 - 1].supplyCount,
          preBalancePrice: this.data[this.data.length - 1 - 1].supplyPrice,
          balanceCount: this.data[this.data.length - 1 - 1].supplyCount,
          template_id: new Date().getTime()
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