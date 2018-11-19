<template>
  <loading-box>
    <my-table index stripe border size="mini" :selection="select" :thead="thead" :data.sync="newData" @selection-change="selectionChange">
    </my-table>
  </loading-box>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return [];
        }
      },
      initData: {
        type: Array,
        default () {
          return [];
        }
      }
    },
    data() {
      return {
        newData: [],
      }
    },
    computed: {
      select() {},
      thead() {
        let thead = {
          'businessTrains.balancedSettlement': {
            name: '已用结算款结算金额',
          },
          'businessTrains.balancedPrepaid': {
            name: '已用预付款结算金额',
          },
          invoiced: {
            name: '已开票金额',
            slot: true
          },
          invo: {
            name: '可开票金额',
            slot: true
          },
          invoiceBalance: {
            name: '开票金额',
            slot: true
          },
          company: {
            name: '支付方',
            slot: true,
            readOnly: true
          },
          receivedCompany: {
            name: '收款方',
            readOnly: true,
            slot: true
          }
        }
        return thead;
      },
    },
    methods: {
      selectionChange(val) {},
    },
    created() {
      this.newData = JSON.parse(JSON.stringify(this.initData));
    }
  }
</script>

<style scoped>

</style>