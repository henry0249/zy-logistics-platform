<template>
  <loading-box v-model="loadingText">
    <div class="g-order-container">
      <div style="height:40px;margin-bottom:15px">
        <el-tabs v-model="activeCompany">
          <el-tab-pane :name="item._id" v-for="(item) in companylist" :key="item._id">
            <div slot="label" style="position:relative">
              {{item.name || item.nick}}
              <el-badge :value="item.badge" v-if="item.badge!==undefined && item.badge>0">
              </el-badge>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div style="height:calc(100vh - 50px - 40px - 15px - 60px)">
          <my-table ref="table" :thead="thead" :data.sync="data" selection border height="100vh - 50px - 40px - 15px - 60px" size="mini" @selection-change="handleSelectionChange" :loadmore="loadmore">
            <template slot-scope="scope">
              <div class="link" v-if="scope.prop==='no'" @click="toDetail(scope.row,scope.index)">
                {{scope.row.no}}
              </div>
              <div v-if="scope.prop==='customer'">
                <el-tag v-if="scope.row.user" size="mini" style="margin-right:5px" type="warning">个人</el-tag>
                <el-tag v-if="scope.row.company" size="mini" style="margin-right:5px" type="success">公司</el-tag>
                {{scope.row | customerName}}
              </div>
              <div v-if="scope.prop==='goodsName'">
                {{scope.row.goods && scope.row.goods.name}}
              </div>
              <div v-if="scope.prop==='goodsCount'">
                {{scope.row.count}}{{scope.row.goods && scope.row.goods.unit}}
              </div>
              <div v-if="scope.prop==='area'">
                {{area2name(scope.row.area)}}
              </div>
              <div v-if="scope.prop === 'balancePrice'">
                <my-form-item v-model="scope.row.businessTrains.balancePrice" size="mini" number :min="0"></my-form-item>
              </div>
              <div v-if="scope.prop === 'balanceCount'">
                <my-form-item v-model="scope.row.businessTrains.balanceCount" size="mini" number :min="0"></my-form-item>
              </div>
            </template>
          </my-table>
        </div>
        <div class="flex ac jb" style="height:60px">
          <el-badge :value="data.length" class="item">
            <el-button type="success" size="mini">全部审核通过</el-button>
          </el-badge>
          <div class="flex ac">
            <div class="flex ac jb" style="width:250px">
              <my-form-item v-model="balancePriceMutil" size="mini" label="结算金额" number width="150px" :min="0">
              </my-form-item>
              <el-badge :value="select.length" class="item">
                <el-button type="warning" size="mini" @click="balancePriceMutilEdit">批量修改</el-button>
              </el-badge>
            </div>
            <div style="width:3vw"></div>
            <div class="flex ac jb" style="width:250px">
              <my-form-item v-model="balanceCountMutil" size="mini" label="结算数量" number width="150px" :min="0">
              </my-form-item>
              <el-badge :value="select.length" class="item">
                <el-button type="warning" size="mini" @click="balanceCountMutilEdit">批量修改</el-button>
              </el-badge>
            </div>
          </div>
          <el-badge :value="select.length" class="item">
            <el-button type="primary" size="mini">预审通过</el-button>
          </el-badge>
        </div>
      </div>
    </div>
  </loading-box>
</template>

<script>
import { table } from "./field";
export default {
  data() {
    return {
      loadingText: "",
      activeCompany: "",
      companylist: [],
      tableEl: "",
      thead: table,
      data: [],
      select: [],
      path: "/order/pending/financialPretrial",
      limit: 10,
      balancePriceMutil: 0,
      balanceCountMutil: 0
    };
  },
  watch: {
    activeCompany(newValue, oldValue) {
      this.getData();
    },
    balancePriceMutil(val) {
      this.balanceMutilChange("balancePrice", val);
    },
    balanceCountMutil(val) {
      this.balanceMutilChange("balanceCount", val);
    }
  },
  methods: {
    async getCompanylist() {
      this.activeCompany = this.company._id;
      this.loadingText = "加载中";
      try {
        this.companylist = await this.$ajax.post("/order/company/badge", {
          state: "financialPretrial",
          handle: this.activeCompany
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async getData() {
      this.loadingText = "加载中";
      try {
        this.data = await this.$ajax.post(this.path, {
          handle: this.activeCompany,
          limit: this.limit
        });
      } catch (error) {}
      this.loadingText = "";
    },
    async loadmore() {
      return await this.$ajax.post(this.path, {
        handle: this.activeCompany,
        limit: this.limit,
        skip: this.data.length
      });
    },
    toDetail(item, index) {
      if (item._id) {
        this.$router.push(`/edit/FinancialPretrial/${item._id}`);
      }
    },
    handleSelectionChange(val) {
      this.select = val;
    },
    balancePriceMutilEdit() {},
    balanceCountMutilEdit() {},
    balanceMutilChange(type, val) {
      let selectTemp = [...this.select];
      this.select.forEach(selectItem => {
        this.data.forEach((dataItem, index) => {
          if (selectItem._id === dataItem._id) {
            let newItem = JSON.parse(JSON.stringify(dataItem));
            newItem.businessTrains[type] = val;
            this.$set(this.data, index, newItem);
          }
        });
      });
      this.$refs.table.toggleRowSelection(selectTemp);
    }
  },
  async mounted() {
    await this.getCompanylist();
    await this.getData();
  }
};
</script>

<style scoped>
</style>