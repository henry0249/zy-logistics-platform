<template>
  <div>
    <common-select isSwitch label="选择" :data.sync="value1" @switchChange="switchChange" border width="25%" title="用户选择" type="truck" size="mini"></common-select>
    <my-table :data.sync="data" :thead="thead">
      <template slot-scope="scope" v-if="scope.column.property === 'value'">
            <common-select isSwitch :data.sync="scope.row['value']" @switchChange="switchChange" border width="100%" title="用户选择" type="goods" size="mini"></common-select>
</template>
    </my-table>
  </div>
      <!-- <my-table index size="mini" edit :thead="tableHeader" :data.sync="tableList">
<template slot-scope="scope" v-if="scope.column.property === 'tag'||scope.column.property === 'name'">
  <el-tag v-if="scope.column.property === 'tag'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['tag']" :key="item.id">
    {{item}}</el-tag>
  <i title="点击查看详情" class="pointer name-txt" v-if="scope.column.property === 'name'" @click="op({type:'read',value:scope})">{{scope.row['name']}}</i>
</template>
    </my-table> -->
</template>

<script>
  export default {
    data() {
      return {
        data: [{
          value: {},
          key: ''
        }],
        thead: {
          value: {
            name: '值',
            readOnly: true,
            slot: true,
          },
          key: {
            name: 'key'
          }
        },
        value2: {},
        value3: [],
        value: {
          email: "75776584@com",
          name: "用户2",
          mobile: "18877575234",
          _id: '5b233826ae796f83628d4065'
        },
        value1: [{
          no: '12233',
          email: "75776584@com",
          name: "用户1",
          mobile: "18877575234",
          _id: '5b233729ae796f83628d405d'
        }, {
          no: '334585',
          email: "75776584@com",
          name: "用户2",
          mobile: "18877575234",
          _id: '5b233826ae796f83628d4065'
        }, ]
      }
    },
    watch: {
      value1(val) {
        console.log('!!', val);
      }
    },
    methods: {
      switchChange(val) {
        console.log('!!!', val);
      }
    }
  }
</script>

<style scoped>

</style>