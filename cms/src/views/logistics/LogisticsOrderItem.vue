<template>
  <my-form size="mini" width="24%">
    <div class="flex ac jb">
      <div style="width:24%">
        <my-select :type.sync="order.type" :data.sync="order[order.type]" label="下单客户" placeholder="请选择客户" @change="customerChange"></my-select>
      </div>
      <my-form-item datetime v-model="order.deliveryTime" label="配送时间">
      </my-form-item>
      <my-form-item select v-model="order.settlementMethod" label="结算方式" :options="field.Order.settlementMethod.option">
      </my-form-item>
      <my-form-item select v-model="order.transportModel" label="运输方式" :options="field.Order.transportModel.option">
      </my-form-item>
    </div>
    <div class="flex ac jb" style="margin:15px 0">
      <my-form-item select v-model="order.invoiceType" label="发票类型" :options="field.Order.invoiceType.option">
      </my-form-item>
      <my-form-item @click.native="showCompanyUserCascader" input :popover="order.type==='company'?true:undefined" v-model="order.contactName" label="收货人">
        <div slot="inputPopover">
          <loading-box v-model="companyUserCascaderLoaidng">
            <free-select :data="companyUserCascader" @change="companyUserCascaderChange"></free-select>
          </loading-box>
        </div>
      </my-form-item>
      <my-form-item input v-model="order.contactNumber" label="联系电话">
      </my-form-item>
      <div style="width:24%">
        <my-select area :data.sync="order.area" label="送货地址" @change="areaChange"></my-select>
      </div>
    </div>
    <my-form-item width="100%" style="margin:15px 0" input v-model="order.address" label="详细地址">
    </my-form-item>
    <my-form-item width="100%" input type="textarea" v-model="order.remark" autosize label="订单备注">
    </my-form-item>
  </my-form>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data () {
      return {
        order:{}
      }
    },
    methods: {
      customerChange(val){},
    },
    created () {
      if (Object.keys(this.data).length > 0) {
        this.order = JSON.parse(JSON.stringify())
      }
    }
  }
</script>

<style scoped>

</style>