<template>
  <loading-box>
    <my-table border size="mini" :thead="thead" :data="data">
      <div slot-scope="scope">
        <!-- <div>{{test(scope)}}</div> -->
        <el-tag size="small" :type="tagType(scope)" v-if="scope.prop === 'type'">{{field.BusinessTrains.type.option[scope.row[scope.prop]]}}</el-tag>
        <div class="blue" v-if="scope.prop === 'order'">{{scope.row[scope.prop].no}}</div>
        <div class="blue" v-if="scope.prop === 'logistics'">{{test(scope)}}</div>
        <div v-if="scope.prop === 'userName'">
          {{scope.row[scope.prop].nick || scope.row[scope.prop].name}}
          <el-tag size="mini" :type="scope.row.customerType === 'user'?'success':'danger'">{{field.BusinessTrains.customerType.option[scope.row.customerType]}}</el-tag>
        </div>
      </div>
    </my-table>
  </loading-box>
</template>

<script>
  export default {
    props: {
      val: {
        type: Object,
        default () {
          return {}
        }
      },
    },
    data() {
      return {
        data: [],
      }
    },
    computed: {
      thead() {
        let thead = {
          type: {
            name: '类型',
            slot: true
          },
          userName: {
            name: '客户名称',
            slot: true
          },
          order: {
            name: '所属订单',
            slot: true
          },
          // transportTrains: {
          //   name: '关联的物流链',
          //   slot: true
          // },
          // logistics: {
          //   name: '关联的运单',
          //   slot: true
          // },
          supplyPrice: {
            name: '供货价格'
          },
          supplyCount: {
            name: '供货数量'
          },
          receive: {
            name: '实收数量'
          },
          loss: {
            name: '损耗数量'
          },
          balancePrice: {
            name: '结算价格'
          },
          balanceCount: {
            name: '结算数量'
          },
        }
        return thead;
      }
    },
    methods: {
      tagType(val) {
        let data = {
          supplier: 'success',
          pool: 'warning',
          customer: 'danger'
        }
        return data[val.row[val.prop]];
      },
      test(val) {
        console.log(val);
        if (val.prop) {}
      }
    },
    created() {
      if (this.val) {
        let data = JSON.parse(JSON.stringify(this.val));
        if (data.user) {
          this.$set(data, 'userName', data.user);
        } else {
          this.$set(data, 'userName', data.company || '');
        }
        this.data.push(data);
      }
    }
  }
</script>

<style scoped>

</style>