<template>
  <div>
    <common-select isSwitch label="选择" :data.sync="value1" @switchChange="switchChange" border width="25%" title="用户选择" type="user" size="mini"></common-select>
    <my-table :data.sync="data" :thead="thead">
      <template slot-scope="scope" v-if="scope.column.property === 'value'">
          <common-select isSwitch :data.sync="scope.row['value']" @switchChange="switchChange" border width="100%" title="用户选择" type="goods" size="mini"></common-select>
</template>
    </my-table>
  </div>
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