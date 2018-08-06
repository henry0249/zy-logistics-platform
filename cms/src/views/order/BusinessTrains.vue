<template>
  <div class="g-business-trains">
    <el-alert v-if="alert" title="贸易链" type="info" :closable="false" style="margin:15px 0">
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
    <div ref="main" v-overflow-tool v-if="order.goods && order.goods._id && order.count>0 && order[order.type]._id" style="max-height:400px;overflow:auto;transition: all .2s">
      <div v-for="(item,index) in data" :key="index">
        <div class="flex ac goods-title">
          <div class="bor tc" style="padding:8px 0;width:50px;color:#409EFF">
            # {{index+1}}
          </div>
          <div class="f1 flex ac jb">
            <div class="f1"></div>
            <div style="width:44%">
              <common-select v-if="trainsType(index)===0 || trainsType(index)===1" :data.sync="order.goods.mfrs" type="company" disabled label="生产厂商" size="mini" border></common-select>
              <common-select v-if="trainsType(index)===2 || trainsType(index)===3" :data.sync="item.fromCompany" type="company" label="联营商" size="mini" border @change="fromCompanyChange($event,index)"></common-select>
            </div>
            <div class="f1"></div>
            <div style="width:44%">
              <common-select v-if="trainsType(index)===0 || trainsType(index)===3" :data.sync="order[order.type]" :type="order.type" disabled label="收货客户" size="mini" border></common-select>
              <common-select v-if="trainsType(index)===1 || trainsType(index)===2" :data.sync="item.toCompany" type="company" label="联营商" size="mini" border @change="toCompanyChange($event,index)"></common-select>
            </div>
            <div class="f1"></div>
          </div>
          <div class="tc bol" style="width:45px;padding:8px 0">
            <i @click="remove(item,index)" style="color:#F56C6C" class="el-icon-delete pointer"></i>
          </div>
        </div>
        {{item.type}}
        <my-table opWidth="45" size="mini" border :thead="thead" :data.sync="temp">
          <div slot-scope="scope">
            <div v-if="scope.prop==='purchasePrice'">
              <div v-if="index === 0">
                {{order.factory}}
              </div>
              <my-form-item v-else :disabled="thead[scope.prop].disabled" input popover size="mini" v-model="item.purchasePrice">
                <div slot="inputPopover">
                  <div class="trains-tip flex ac" v-if="index === 0">
                    商品出厂单价：
                    <div class="tip-text">{{order.factory}}</div>
                    <div class="link" style="margin-left:10px" @click="item.purchasePrice = order.factory">粘贴</div>
                  </div>
                  <div class="trains-tip flex ac" v-if="index > 0">
                    上一贸易链售价：
                    <div class="tip-text">{{data[index-1].sellPrice}}</div>
                    <div class="link" style="margin-left:10px" @click="item.purchasePrice = data[index-1].sellPrice">粘贴</div>
                  </div>
                </div>
              </my-form-item>
            </div>
            <div v-if="scope.prop==='purchaseCount'">
              <div v-if="index === 0">
                {{order.count}}
              </div>
              <my-form-item v-else :disabled="thead[scope.prop].disabled" input popover size="mini" v-model="item.purchaseCount">
                <div slot="inputPopover">
                  <div class="trains-tip flex ac" v-if="index === 0">
                    商品下单数量：
                    <div class="tip-text">{{order.count}}</div>
                    <div class="link" style="margin-left:10px" @click="item.purchaseCount = order.count">粘贴</div>
                  </div>
                  <div class="trains-tip flex ac" v-if="index > 0">
                    上一贸易链出货数：
                    <div class="tip-text">{{data[index-1].sellCount}}</div>
                    <div class="link" style="margin-left:10px" @click="item.purchaseCount = data[index-1].sellCount">粘贴</div>
                  </div>
                </div>
              </my-form-item>
            </div>
            <div v-if="scope.prop==='sellPrice'">
              <div v-if="index === data.length-1">
                {{order.sell}}
              </div>
              <my-form-item v-else :disabled="thead[scope.prop].disabled" input :popover="index !== data.length-1?true:undefined" size="mini" v-model="item.sellPrice">
                <div slot="inputPopover">
                  <div class="trains-tip flex ac" v-if="index !== data.length-1">
                    当前进价：
                    <div class="tip-text">{{item.purchasePrice}}</div>
                    <div class="link" style="margin-left:10px" @click="item.sellPrice = order.purchasePrice">粘贴</div>
                  </div>
                  <div class="trains-tip" style="color:#ccc;margin-top:5px">
                    最大售价：{{order.sell}}
                  </div>
                </div>
              </my-form-item>
            </div>
            <div v-if="scope.prop==='sellCount'">
              <div v-if="index === data.length-1">
                {{order.count}}
              </div>
              <my-form-item v-else :disabled="thead[scope.prop].disabled" input :popover="index !== data.length-1?true:undefined" size="mini" v-model="item.sellCount">
                <div slot="inputPopover">
                  <div class="trains-tip flex ac" v-if="index !== data.length-1">
                    当前进货数：
                    <div class="tip-text">{{item.purchaseCount}}</div>
                    <div class="link" style="margin-left:10px" @click="item.sellCount = item.purchaseCount">粘贴</div>
                  </div>
                  <div class="trains-tip" style="color:#ccc;margin-top:5px">
                    最大出货数：{{item.purchaseCount}}
                  </div>
                </div>
              </my-form-item>
            </div>
            <div v-if="scope.prop==='remark'">
              <my-form-item :disabled="thead[scope.prop].disabled" size="mini" v-model="item.remark"></my-form-item>
            </div>
          </div>
        </my-table>
      </div>
    </div>
    <div class="tc" style="color:#ccc;padding:10px 0" v-else>
      <div v-if="!order[order.type]._id">请先选择客户</div>
      <div v-else-if="!(order.goods && order.goods._id)">请先选择商品</div>
      <div v-else-if="Number(order.count)<=0">商品数量必须大于0</div>
    </div>
    <!-- <div @click="spread" class="tc link" style="font-size:12px;padding:5px 0" v-if="overflowToolShow">
      显示全部<i class="el-icon-arrow-down"></i>
    </div>
    <div @click="retract" class="tc link" style="font-size:12px;padding:5px 0" v-if="retractToolShow">
      收起<i class="el-icon-arrow-up"></i>
    </div> -->
  </div>
</template>

<script>
import { businessTrains } from "./field";
export default {
  props: {
    alert: {
      type: Boolean,
      default: true
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
  watch: {
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
      let body = {
        fromCompany: {},
        toCompany: {},
        purchasePrice: 0,
        purchaseCount: 0,
        sellPrice: 0,
        sellCount: 0,
        remark: ""
      };
      if (this.data.length === 0) {
        body.purchasePrice = this.order.factory;
        body.purchaseCount = this.order.count;
        body.sellPrice = this.order.sell;
        body.sellCount = this.order.count;
      }
      if (this.data.length > 0) {
        let index = this.data.length - 1;
        body.purchasePrice = this.data[index].sellPrice;
        body.purchaseCount = this.data[index].sellCount;
        body.sellPrice = this.data[index].sellPrice;
        body.sellCount = this.data[index].sellCount;
        if (this.data.length > 1 && !this.data[index].fromCompany._id) {
          this.$message.error("联营商不能为空");
          return;
        }
      }
      this.data.push(body);
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
.trains-tip {
  font-size: 12px;
  color: #606266;
}
.tip-text {
  color: #f56c6c;
  font-weight: 600;
}
</style>