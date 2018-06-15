<template>
  <platform-table class="auto" v-model="loadingText" :thead="thead" :data="data" @op="op" @search="search" @add="add">
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
            slot:true
          },
          mobile: {
            name: '手机号',
            readOnly: true,
          },
          platform: {
            name: '平台',
            readOnly: true,
            slot:true
          },
          company: {
            name: '公司',
            readOnly: true,
            slot:true
          },
          tag: {
            name: '标签',
            readOnly: true,
            slot:true
          }
        },
        data: [],
      }
    },
    methods: {
      add(){
        this.$router.push({path:'/platform/user_add'})
      },
      search(val){
        console.log(val);
      },
      op(val){
        this.$router.push({path:`/platform/user_edmit/${val}`})
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
        } catch (error) {
        }
      }
    },
    async created() {
      this.loadingText = '加载中';
      await this.getData();
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