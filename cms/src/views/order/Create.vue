<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>销售订单</strong>
        </div>
        <my-form size="mini" width="24%" style="margin:15px 0">
          <div class="flex ac jb">
            <my-form-item cascader v-model="order.customer" filterable  label="客户名称" :options="customer">
            </my-form-item>
            <my-form-item select v-model="order.settlementMethod" label="结算方式" :options="field.Order.settlementMethod.option">
            </my-form-item>
            <my-form-item select v-model="order.transportModel" label="运输方式" :options="field.Order.transportModel.option">
            </my-form-item>
            <my-form-item input v-model="order.deliveryTime" label="配送时间">
            </my-form-item>
          </div>
          <div class="flex ac jb" style="margin:15px 0">
            <my-form-item select v-model="order.invoiceType"  label="发票类型" :options="field.Order.invoiceType.option">
            </my-form-item>
            <my-form-item input v-model="order.contactName" label="收货人">
            </my-form-item>
            <my-form-item input v-model="order.contactMobile" label="联系电话">
            </my-form-item>
            <my-form-item input v-model="order.address" label="送货地址">
            </my-form-item>
          </div>
          <my-form-item width="100%" input type="textarea" autosize label="订单备注">
          </my-form-item>
        </my-form>
        <div>
          <my-table size="small" index edit border :thead="thead" :data.sync="data">
            <my-form-item select v-model="goods.brand" :options="brands" filterable size="mini" @click.stop v-if="scope.column.property === 'brand'" slot-scope="scope">
            </my-form-item>
          </my-table>
        </div>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" type="primary">立即创建</el-button>
        <el-button size="small">取消</el-button>
      </div>
      <div>
        {{order}}
      </div>
    </div>
  </loading-box>
</template>

<script>
import { create } from "./field";
export default {
  data() {
    let field = create;
    let goods = {};
    for (const key in field) {
      goods[key] = "";
    }
    return {
      loadingText: "",
      data: [
        {
          ...goods
        }
      ],
      goods: goods,
      order: {
        customer: [],
        settlementMethod: "",
        transportModel: "",
        deliveryTime: new Date(),
        invoiceType: "",
        contactName: "",
        contactMobile: "",
        address: ""
      },
      thead: field,
      customer: [],
      brands:[]
    };
  },
  methods: {
    async cellEdit(val) {
      console.log(val);
    },
    async getData() {
      this.loadingText = "加载中";
      this.customer = [];
      try {
        let users = await this.$ajax("/user/find");
        let companys = await this.$ajax("/company/find");
        this.brands = await this.$ajax("/brand/find");
        users.forEach(item => {
          item.label = item.name || item.mobile;
          item.value = item._id;
        });
        companys.forEach(item => {
          item.label = item.name || item.mobile;
          item.value = item._id;
        });
        this.customer = [
          {
            value: "company",
            label: "公司",
            children: companys
          },
          {
            value: "user",
            label: "个人",
            children: users
          }
        ];
      } catch (error) {}
      this.loadingText = "";
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style scoped>
.g-order-create {
  padding: 20px;
}
.g-order {
  margin: 0 auto;
  padding: 30px;
  /* box-shadow: 0 0 10px rgba(0,0,0,.2); */
  border: 1px solid #eee;
  border-radius: 4px;
}
</style>