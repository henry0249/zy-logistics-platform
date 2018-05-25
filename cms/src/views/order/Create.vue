<template>
  <div>
    <div style="margin-top:10px;padding:10px 20px">
      <div class="g-order">
        <div class="tc" style="font-size:22px;padding-bottom:20px">
          <strong>销售订单</strong>
        </div>
        <my-form size="mini" width="24%" style="margin-top:20px">
          <div class="flex ac jb">
            <my-form-item input label="客户名称" placeholder="请输入内容">
            </my-form-item>
            <my-form-item select label="结算方式">
            </my-form-item>
            <my-form-item select label="运输方式">
            </my-form-item>
            <my-form-item input label="配送时间">
            </my-form-item>
          </div>
          <div class="flex ac jb" style="margin:15px 0">
            <my-form-item select label="发票类型">
            </my-form-item>
            <my-form-item input label="收货人">
            </my-form-item>
            <my-form-item input label="联系电话">
            </my-form-item>
            <my-form-item input label="送货地址">
            </my-form-item>
          </div>
        </my-form>
        <div>
          <my-table size="small" index edit border @cellEdit="cellEdit" :thead="filed" :data.sync="data">
          </my-table>
        </div>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" type="primary">立即创建</el-button>
        <el-button size="small">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      let filed = {
        brand: {
          name: "品牌",
          type: "ObjectId"
        },
        name: {
          name: "名称",
          type: "String",
          require: true
        },
        unit: {
          name: "单位",
          type: "String",
          require: true
        },
        goodsCount: {
          name: "数量"
        },
        sellPrice: {
          name: "销售单价"
        },
        transportPrice: {
          name: "运输单价"
        },
        totalPrice: {
          name: "合计金额"
        }
      };
      let goods = {};
      for (const key in filed) {
        goods[key] = "";
      }
      return {
        data: [{
          ...goods
        }],
        goods: goods,
        order: {
          user: {},
          company: {},
          settlementMethod: 0,
          transportModel: 0,
          deliveryTime: new Date(),
          invoiceType: 0
        },
        filed: filed
      };
    },
    methods: {
      async cellEdit(val) {
        console.log(val);
      }
    }
  };
</script>

<style scoped>
  .g-order {
    margin: 0 auto;
    padding: 30px;
    /* box-shadow: 0 0 10px rgba(0,0,0,.2); */
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>