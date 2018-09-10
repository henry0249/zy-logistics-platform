<template>
  <loading-box v-model="loadingText">
    <stock-top v-if="show" @sub="sub" :loadingText.sync="loading"></stock-top>
    <div>
      <common-table v-if="show" :path="path" :thead="thead" height="100vh - 40vh - 50px" style="padding:0 3%" :searchSlot="false" :option="op">
        <template slot-scope="scope">
          <div v-if="scope.prop === 'type'">{{field.Stock.type.option[scope.row['type']]}}</div>
          <div v-if="scope.prop === 'createdAt'">{{changeDate(scope.row['createdAt'])}}</div>
        </template>
      </common-table>
    </div>
  </loading-box>
</template>

<script>
  import StockTop from './StockTop.vue';
  export default {
    components: {
      StockTop
    },
    data() {
      return {
        op: {
          sort: {
            createdAt: -1
          }
        },
        show: true,
        loadingText: "",
        loading: '',
        updateAt: new Date(),
        historyType: "week",
        historyTypeOptions: [{
            value: "week",
            label: "最近一周"
          },
          {
            value: "month",
            label: "最近一月"
          },
          {
            value: "quarter",
            label: "最近一季度"
          },
          {
            value: "year",
            label: "最近一年"
          }
        ],
        path: "/stock/find",
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
          }
        }
      };
    },
    watch: {
      company: {
        handler(val) {
          this.show = false;
          this.$set(this.op, 'company', val._id);
          this.$nextTick(() => {
            this.show = true;
          })
        },
        deep: true
      },
      op: {
        handler(val) {
          console.log(val);
        },
        deep: true
      }
    },
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
      sub(val) {
        this.show = val;
        this.$nextTick(() => {
          this.show = !val;
        })
      }
    },
    created() {
      this.$set(this.op, 'company', this.company._id);
    }
  };
</script>

<style scoped>

</style>