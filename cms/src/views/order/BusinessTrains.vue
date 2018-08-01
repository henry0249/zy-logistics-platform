<template>
  <div class="g-business-trains">
    <el-alert title="贸易链" type="info" :closable="false" style="margin:15px 0">
    </el-alert>
    <div v-if="order.goods && order.goods._id" class="flex ac jb" style="color:#909399;padding-left:20px;background:#F2F6FC;font-size:13px">
      <div class="goods-info-padding">商品名称：{{order.goods.name}}</div>
      <div class="goods-info-padding">品牌：{{order.goods.brand.name}}</div>
      <div class="goods-info-padding">规格：{{order.goods.spec}}</div>
      <div class="goods-info-padding">单位：{{order.goods.unit}}</div>
      <div class="f1"></div>
      <div class="tc bol" style="width:46px;padding:8px 0">
        <i @click="add" style="color:#67C23A" class="el-icon-plus pointer"></i>
      </div>
    </div>
    <div ref="main" v-overflow-tool v-if="order.goods && order.goods._id" style="max-height:400px;overflow:auto;transition: all .2s">
      <div v-for="(item,index) in data" :key="index">
        <div class="flex ac goods-title">
          <div class="bor tc" style="padding:8px 0;width:50px;color:#409EFF">
            # {{index+1}}
          </div>
          <div class="f1 flex ac jb">
            <div class="f1"></div>
            <div style="width:44%">
              <common-select v-if="trainsType(index)===0 || trainsType(index)===1" :data.sync="order.goods.mfrs" type="company" disabled label="生产厂商" size="mini" border ></common-select>
              <common-select v-if="trainsType(index)===2 || trainsType(index)===3" :data.sync="item.fromCompany" type="company" label="联营商" size="mini" border  @change="fromCompanyChange($event,index)"></common-select>
            </div>
            <div class="f1"></div>
            <div style="width:44%">
              <common-select v-if="trainsType(index)===0 || trainsType(index)===3" :data.sync="order[order.type]" :type="order.type" disabled label="收货客户" size="mini" border ></common-select>
              <common-select v-if="trainsType(index)===1 || trainsType(index)===2" :data.sync="item.toCompany" type="company" label="联营商" size="mini" border  @change="toCompanyChange($event,index)"></common-select>
            </div>
            <div class="f1"></div>
          </div>
          <div class="tc bol" style="width:45px;padding:8px 0">
            <i @click="remove(item,index)" style="color:#F56C6C" class="el-icon-delete pointer"></i>
          </div>
        </div>
        <my-table opWidth="45" size="mini" border :thead="thead" :data.sync="temp">
          <div slot-scope="scope">
            <div v-if="scope.prop==='purchasePrice'">
              <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="item.purchasePrice"></my-form-item>
            </div>
            <div v-if="scope.prop==='purchaseCount'">
              <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="item.purchaseCount"></my-form-item>
            </div>
            <div v-if="scope.prop==='sellPrice'">
              <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="item.sellPrice"></my-form-item>
            </div>
            <div v-if="scope.prop==='sellCount'">
              <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="item.sellCount"></my-form-item>
            </div>
            <div v-if="scope.prop==='remark'">
              <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="item.remark"></my-form-item>
            </div>
          </div>
        </my-table>
      </div>
    </div>
    <div class="tc" style="color:#ccc;padding:10px 0" v-else>
      请先选择商品
    </div>
    <div @click="spread" class="tc link" style="font-size:12px;padding:5px 0" v-if="overflowToolShow">
      显示全部<i class="el-icon-arrow-down"></i>
    </div>
    <div @click="retract" class="tc link" style="font-size:12px;padding:5px 0" v-if="retractToolShow">
      收起<i class="el-icon-arrow-up"></i>
    </div>
  </div>
</template>

<script>
import { businessTrains } from "./field";
export default {
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
    }
  },
  data() {
    return {
      data: [],
      temp: [{}],
      overflowToolShow: false,
      retractToolShow: false
    };
  },
  directives: {
    overflowTool: {
      inserted(el, binding, vnode) {
        let _this = vnode.context;
        setTimeout(() => {
          _this.overflowToolShow = el.scrollHeight > el.clientHeight;
        }, 200);
      },
      update(el, binding, vnode) {
        let _this = vnode.context;
        setTimeout(() => {
          _this.overflowToolShow = el.scrollHeight > el.clientHeight;
        }, 200);
      }
    }
  },
  methods: {
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
        fromCompany: {},
        toCompany: {},
        purchasePrice: this.order.sell,
        purchaseCount: this.order.count,
        sellPrice: 0,
        sellCount: 0,
        remark: ""
      });
    },
    fromCompanyChange(val, index) {
      this.data[index - 1].toCompany = val;
    },
    toCompanyChange(val, index) {
      this.data[index + 1].fromCompany = val;
    },
    spread() {
      this.$refs.main.style = {};
      this.overflowToolShow = false;
      this.retractToolShow = true;
    },
    retract() {
      this.$refs.main.style.maxHeight = "400px";
      this.$refs.main.style.overflow = "auto";
      this.retractToolShow = false;
      this.overflowToolShow = true;
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