<template>
  <loading-box v-model="loadingText" style="position: relative;">
    <stock-table v-if="!loadingText" @remove="remove" @sub="sub" :state="activeName"></stock-table>
  </loading-box>
</template>

<script>
  import StockTable from "./StockTable.vue";
  export default {
    components: {
      StockTable
    },
    props: {
      activeName: {
        type: String,
        default: 'finish'
      },
    },
    data() {
      return {
        loadingText: "",
      };
    },
    methods: {
      sub(scope) {
        this.$router.push({
          path: '/stock/ready_list/edit',
          query: {
            type: scope.row.type,
            _id: scope.row._id,
            // parentPath:this.$route.path,
            // parentName:this.$route.name
          }
        })
      },
      async remove(val) {
        try {
          this.loadingText = '删除中';
          let del = await this.$api.stock.deleteStock({
            _id: val.row._id
          })
          this.$message.success('删除成功！');
        } catch (error) {}
        this.loadingText = '';
      }
    }
  };
</script>

<style scoped>
  .c {
    position: absolute;
  }
</style>