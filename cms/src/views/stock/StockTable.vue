<template>
  <common-table height="calc(100vh - 92px)" style="padding:0" path="stock/find" :option="option" :thead="thead">
    <template slot-scope="scope">
      <div v-if="scope.prop === 'type'">{{field.Stock.type.option[scope.row['type']]}}</div>
      <div v-if="scope.prop === 'createdAt'">{{changeDate(scope.row['createdAt'])}}</div>
    </template>
  </common-table>
</template>

<script>
  export default {
    data() {
      return {
        option: {},
        thead: {
          type: {
            name: "变化类型",
            slot: true
          },
          num: {
            name: "数量",
          },
          new: {
            name: "操作后库存",
          },
          dv: {
            name: "差值",
          },
          createdAt: {
            name: "操作日期",
            slot: true
          },
          state: {
            name: '状态',
            slot: true
          }
        }
      }
    },
    watch: {},
    methods: {
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
      },
    },
    created() {
      if (this.$attrs.type === 'ready') {
        this.$set(this.thead, 'op', {
          name: '操作',
          slot: true
        });
        this.$set(this.option, 'state', 'ready');
      } else {
        delete this.option.state
        this.$set(this.option, '$or', [{
            state: {
              $exists: false
            }
          },
          {
            state: 'finish'
          }
        ])
      }
    }
  }
</script>

<style scoped>

</style>