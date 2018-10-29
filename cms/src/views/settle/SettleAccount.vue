<template>
  <loading-box v-model="loadingText">
    <div v-if="settlelist.length > 0" class="body-padding" style="margin-top:15px">
      <account-change-card>
      
      </account-change-card>
      <el-card style="margin-top:25px">
        <div style="padding:0 5px">
          <div class="flex ac info">
            <div style="width:10%">订单号</div>
            <div style="width:20%">商品信息</div>
            <div class="f1 tc"></div>
            <div class="tr" style="width: 13%">结算款</div>
            <div class="tr" style="width: 13%">结算款</div>
            <div class="tr" style="width: 13%">总金额</div>
          </div>
          <div class="flex ac settle-item" v-for="(item,index) in settlelist" :key="index">
            <div class="blue" style="width:10%">{{item.order.no}}</div>
            <div class="info" style="width:20%">
              {{item.goods.name}} - {{item.goods.brand.name}} - {{item.goods.spec}}
            </div>
            <div class="f1 info tc">- - -</div>
            <div class="tr warning" style="width: 13%">
              ¥ <span style="font-size:20px">{{item.balanceForAccount}}</span>
            </div>
            <div class="tr warning" style="width: 13%">
              ¥ <span style="font-size:20px">{{item.balanceForAccountPrepaid}}</span>
            </div>
            <div class="tr warning" style="width: 13%">
              ¥ <span style="font-size:30px">{{item.balanceForAccount}}</span>
            </div>
          </div>
          <div class="flex ac settle-item">
            <div class="info" style="width:10%">
              合计
            </div>
            <div class="info" style="width:20%">
              {{settlelist.length}} 条订单
            </div>
            <div class="f1 info tc">
            </div>
            <div class="tr warning" style="width: 13%">
              ¥ {{balanceForAccount}}
            </div>
            <div class="tr warning" style="width: 13%">
              ¥ {{balanceForAccountPrepaid}}
            </div>
            <div class="tr warning" style="width: 13%">
              ¥ {{total}}
            </div>
          </div>
        </div>
        <div class="flex ac">
          <el-button size="small" @click="back">返回</el-button>
          <div class="f1">
          </div>
          <el-button type="success" size="small" @click="submit">确认收款</el-button>
        </div>
      </el-card>
      <div style="height:15px"></div>
    </div>
    <div v-else class="tc" style="margin-top:15vh"> 
      <icon size="200">icon-wufachakan</icon>
      <div class="info" style="margin-top:20px">操作流程已失效，请返回重试</div>
      <el-button type="text" @click="back" icon="el-icon-back">返回</el-button>
    </div>
    
  </loading-box>
</template>

<script>
import AccountChangeCard from "./AccountChangeCard";
export default {
  components: {
    AccountChangeCard
  },
  data() {
    return {
      loadingText: "",
      accountChange: {}
    };
  },
  computed: {
    settlelist() {
      return this.$store.state.businessTrainsSettlelist;
    },
    balanceForAccount() {
      let res = 0;
      this.settlelist.forEach(item => {
        res += item.balanceForAccount;
      });
      return res;
    },
    balanceForAccountPrepaid() {
      let res = 0;
      this.settlelist.forEach(item => {
        res += item.balanceForAccountPrepaid;
      });
      return res;
    },
    total() {
      let res = 0;
      this.settlelist.forEach(item => {
        res += item.balanceForAccountPrepaid + item.balanceForAccount;
      });
      return res;
    }
  },
  methods: {
    async submit() {
      this.loadingText = "加载中...";
      try {
        await this.$ajax.post("/accountChange/set", {
          ...this.accountChange,
          businessTrains: this.settlelist
        });
        this.$message.success('收款成功');
        this.back();
      } catch (error) {}
      this.loadingText = "";
    }
  }
};
</script>

<style scoped>
.settle-item {
  line-height: 70px;
  /* padding: 15px 0; */
}
</style>