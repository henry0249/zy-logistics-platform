<template>
  <loading-box class="js jb">
    <my-table max-height="400" style="width:100%" :thead="thead" :data="data" size="mini" border>
      <div slot-scope="scope">
        <div v-if="scope.prop === 'no'" class="blue">{{scope.row[scope.prop]}}</div>
        <el-tag v-if="scope.prop === 'state'" size="mini" :type="scope.row[scope.prop] === 5?'success':'danger'">{{field.Logistics.state.option[scope.row[scope.prop]]}}</el-tag>
        <div v-if="scope.prop === 'order'" class="blue">{{scope.row[scope.prop].no}}</div>
        <div v-if="scope.prop === 'transportation'">
          {{scope.row.truck?scope.row.truck.no:scope.row.ship.no}}
          <el-tag size="mini" :type="scope.row.truck?'':'danger'">{{field.Logistics.transportation.option[scope.row[scope.prop]]}}</el-tag>
        </div>
      </div>
    </my-table>
  </loading-box>
</template>

<script>
  export default {
    props: {
      val: {
        type: Array,
        default () {
          return [];
        }
      },
    },
    data() {
      return {
        data: [],
        thead: {
          no: {
            name: '单号',
            slot: true
          },
          state: {
            name: '状态',
            slot: true
          },
          loading:{
            name:'装货量'
          },
          landed:{
            name:'卸货量'
          },
          order: {
            name: '所属订单',
            slot: true
          },
          transportation: {
            name: '交通工具',
            slot: true
          }
        }
      }
    },
    methods: {},
    created() {
      if (Object.keys(this.val).length > 0) {
        this.data = JSON.parse(JSON.stringify(this.val));
      }
    }
  }
</script>

<style scoped>
</style>