<template>
  <loading-box v-model="loadingText">
    <stock-top v-if="show" :loadingText.sync="loadingText"></stock-top>
    <div>
      <stock-table v-if="!loadingText" @remove="remove" state="finish" height="100vh - 40vh - 50px" style="padding:0 3%"></stock-table>
    </div>
  </loading-box>
</template>

<script>
  import StockTop from './StockTop.vue';
  import StockTable from './StockTable.vue';
  export default {
    components: {
      StockTop,
      StockTable
    },
    data() {
      return {
        show: true,
        loadingText: "",
      };
    },
    watch: {
      company: {
        handler(val) {
          this.show = false;
          this.$nextTick(() => {
            this.show = true;
          })
        },
        deep: true
      }
    },
    methods: {
      async remove(val) {
        try {
          this.loadingText = '删除中';
          let del = await this.$api.curd({
            model: 'stock',
            curdType: 'delete',
            _id: val.row._id
          })
          this.$message.success('删除成功！');
        } catch (error) {}
        this.loadingText = '';
      },
      typeChange(val) {
        if (val.length > 0) {
          let data = [];
          val.forEach(item => {
            data.push({
              type: item
            })
          });
          this.$set(this.op, '$or', data)
        } else {
          delete this.op.$or;
        }
      },
      stateChange(val) {
        if (val) {
          this.$set(this.op, 'state', val);
        } else {
          delete this.op.state;
        }
      },
      changeDate(msec) {
        let datetime = new Date(msec);
        let year = datetime.getFullYear();
        let month = datetime.getMonth();
        let date = datetime.getDate();
        let hour = datetime.getHours();
        let minute = datetime.getMinutes();
        let second = datetime.getSeconds();
        let result =
          year +
          "-" +
          (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
          "-" +
          (date + 1 < 10 ? "0" + date : date) +
          " " +
          (hour + 1 < 10 ? "0" + hour : hour) +
          ":" +
          (minute + 1 < 10 ? "0" + minute : minute) +
          ":" +
          (second + 1 < 10 ? "0" + second : second);
        return result;
      }
    }
  };
</script>

<style scoped>

</style>