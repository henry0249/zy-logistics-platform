<template>
  <common-table v-if="show" height="calc(100vh - 50px - 35px - 35px)" style="padding:0 1%" path="stock/find" :option="option" :thead="thead">
    <div slot="header" class="jc js">
      <my-form-item width='200px' label="变化类型" @change="typeChange" style="margin-right:20px;" size="mini" multiple collapse-tags v-model="typeData" :options="field.Stock.type.option" select></my-form-item>
      <my-form-item type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" label="起始时间" date style="padding-right:10px;" width="44%" size="mini" v-model="dateArr">
      </my-form-item>
    </div>
    <template slot-scope="scope">
      <div v-if="scope.prop === 'type'">{{field.Stock.type.option[scope.row['type']]}}</div>
      <div v-if="scope.prop === 'createdAt'">{{changeDate(scope.row['createdAt'])}}</div>
      <div v-if="scope.prop === 'state'">{{field.Stock.state.option[scope.row['state']]}}</div>
      <div class="link" v-if="scope.prop === 'op'&&$attrs.state === 'ready'" @click="toFinish(scope)">标记已完成</div>
      <div v-if="scope.prop === 'op'&&$attrs.state === 'finish'">
        <remove-check @remove="remove(scope)"></remove-check>
      </div>
    </template>
  </common-table>
</template>

<script>
  export default {
    props: {
      op: {
        type: Object,
        default () {
          return {}
        }
      },
      height: {
        type: String,
        default: 'calc(100vh - 50px)'
      }
    },
    data() {
      return {
        startDate: '',
        endDate: '',
        dateArr: [],
        show: true,
        typeData: [],
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
          'goods.name':{
            name:'商品',
          },
          createdAt: {
            name: "操作日期",
            slot: true
          },
          state: {
            name: '状态',
            slot: true
          },
          op: {
            name: '操作',
            slot: true
          }
        }
      }
    },
    watch: {
      dateArr: {
        handler(val) {
          if (!val) {
            delete this.option.createdAt;
          } else {
            this.$set(this.option, 'createdAt', {
              $lt: new Date(val[1]).getTime(),
              $gt: new Date(val[0]).getTime()
            })
          }
        },
        deep: true
      },
      company: {
        handler(val) {
          this.show = false;
          this.$set(this.option, 'company', val._id);
          this.$nextTick(() => {
            this.show = true;
          })
        },
        deep: true
      }
    },
    methods: {
      toFinish(scope) {
        this.$emit('sub', scope);
      },
      remove(scope) {
        this.$emit('remove', scope);
      },
      typeChange(val) {
        if (val.length > 0) {
          let data = [];
          val.forEach(item => {
            data.push({
              type: item
            });
          });
          this.$set(this.option, '$or', data);
        } else {
          delete this.option.$or;
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
      },
      changetype() {
        if (this.$attrs.state) {}
        if (!this.$attrs.state) {
          delete this.option.state;
        } else {
          this.$set(this.option, 'state', this.$attrs.state);
        }
        this.$set(this.option, 'sort', {
          createdAt: -1
        });
        this.$set(this.option, 'company', this.company._id);
      }
    },
    created() {
      if (Object.keys(this.op).length > 0) {
        this.option = JSON.parse(JSON.stringify(this.op));
      }
      this.$set(this.option,'populate',[{
        path:'goods'
      }])
      this.changetype();
    }
  }
</script>

<style scoped>

</style>