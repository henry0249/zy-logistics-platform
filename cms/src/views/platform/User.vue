<template>
  <platform-table class="auto" v-model="loadingText" border :thead="thead" :data="data" @op="op" @search="search" @add="add">
    <template slot="tem" slot-scope="scope" v-if="scope.column.property === 'platform'||scope.column.property === 'company'||scope.column.property === 'tag'">
            <el-tag v-if="scope.column.property === 'platform'||scope.column.property === 'company'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row[scope.column.property]" :key="item.id">
            {{item.name}}</el-tag>
            <el-tag v-if="scope.column.property === 'tag'" style="margin-right:10px;" size="mini" type="success" v-for="item in scope.row['tag']" :key="item.id">
            {{item}}</el-tag>
</template>
  </platform-table>
</template>

<script>
  import PlatformTable from './PlatformTable.vue';
  export default {
    components: {
      PlatformTable
    },
    data() {
      return {
        loadingText: '',
        skip: 0,
        thead: {
          name: {
            name: '姓名',
            readOnly: true,
            slot: true
          },
          mobile: {
            name: '手机号',
            readOnly: true,
          },
          platform: {
            name: '平台',
            readOnly: true,
            slot: true
          },
          company: {
            name: '公司',
            readOnly: true,
            slot: true
          },
          tag: {
            name: '标签',
            readOnly: true,
            slot: true
          }
        },
        data: [],
      }
    },
    methods: {
      add() {
        this.$router.push({
          path: '/platform/user_add'
        })
      },
      search(val) {
        console.log(val);
      },
      op(val) {
        this.$router.push({
          path: `/platform/user_edmit/${val}`
        })
      },
      async test() {
        try {
          let res = await this.$api.curd({
            model: 'user',
            curdType: 'update',
            find: {
              _id: '5b3ee199ea6acb62f12346b2'
            },
            update: {
              area: [
                '5b18fe2e7e4da9b84b7e914a',
                '5b18fe967e4da9b84b7e9155',
                '5b18ff4b7e4da9b84b7e917e',
                '5b18ff487e4da9b84b7e917c',
              ]
            }
          })
          let find = await this.$api.curd({
            model:'user',
            curdType:'findOne',
            _id:'5b3ee199ea6acb62f12346b2'
          })
          console.log('test', find);
        } catch (error) {}
      },
      async getData() {
        try {
          this.data = await this.$api.curd({
            model: 'user',
            curdType: 'find',
            limit: 20,
            skip: this.skip,
            populate: [{
              path: 'platform'
            }, {
              path: 'company'
            }]
          })
          console.log(this.data);
        } catch (error) {}
      }
    },
    async created() {
      this.loadingText = '加载中';
      await this.getData();
      await this.test();
      this.loadingText = '';
    }
  }
</script>

<style scoped>
  .auto {
    width: calc(100% - 40px);
    margin: 0 auto;
  }
</style>