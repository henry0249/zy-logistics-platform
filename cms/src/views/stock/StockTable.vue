<template>
  <common-table  v-if="show" height="calc(100vh - 50px - 35px - 35px)" style="padding:0 1%" path="stock/find" :option="option" :thead="thead">
    <div slot="header" class="jc js">
      <my-form-item width='200px' label="库存单类型" @change="typeChange" style="margin-right:20px;" size="mini" multiple collapse-tags v-model="typeData" :options="field.Stock.type.option" select></my-form-item>
      <my-form-item width='200px' v-if="$attrs.state === 'finish'" label="变化类型" @change="dvChange" style="margin-right:20px;" size="mini" collapse-tags v-model="dvData" :options="dvOption" select></my-form-item>
      <my-form-item width='200px' v-else label="状态" @change="stateChange" style="margin-right:20px;" size="mini" collapse-tags v-model="stateData" :options="stateOption" select></my-form-item>
      <my-form-item type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" label="起始时间" date style="padding-right:10px;" width="44%" size="mini" v-model="dateArr">
      </my-form-item>
    </div>
    <div slot-scope="scope">
      <div class="" :class="scope.row['state'] === 'ready'?'link pointer':''" v-if="scope.prop === 'name'" @click="toFinish(scope)">{{scope.row[scope.prop]}}</div>
      <div v-if="scope.prop === 'type'">{{field.Stock.type.option[scope.row['type']]}}</div>
      <div v-if="scope.prop === 'createdAt'">{{formatTime(scope.row['createdAt'])}}</div>
      <div v-if="scope.prop === 'state'">{{field.Stock.state.option[scope.row['state']]}}</div>
      <div v-if="scope.prop === 'num'">{{scope.row[scope.prop]}} {{scope.row.goods.unit}}</div>
      <el-tag size="mini" v-if="scope.prop === 'dv'" :type="dvValue(scope.row['dv']).type">{{dvValue(scope.row['dv']).value}}</el-tag>
    </div>
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
        dvData: '',
        stateData: '',
        show: true,
        typeData: [],
        option: {},
        stateOption: {
          ready: '待处理',
          checked: '已处理',
        },
        dvOption: [{
          label: '增加',
          value: 'jia'
        }, {
          label: '不变',
          value: 'bubian'
        }, {
          label: '减少',
          value: 'jian'
        }]
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
    computed: {
      thead() {
        let thead = {
          name: {
            name: '库存单名称',
            slot: true
          },
          type: {
            name: "库存单类型",
            width:81,
            slot: true
          },
          num: {
            width:100,
            name: "数量",
            slot:true
          },
          dv: {
            name: "变化类型",
            width:50,
            slot: true
          },
          'goods.name': {
            width:200,
            name: '操作商品',
          },
          remake: {
            name: "备注",
          },
          createdAt: {
            name: "操作日期",
            width:130,
            slot: true
          },
          state: {
            name: '状态',
            width:60,
            slot: true
          },
          // ops: {
          //   name: '操作',
          //   slot: true,
          //   width:40
          // }
        }
        if (this.$attrs.state === 'finish') {
          // delete thead.op;
          this.$set(thead, 'dv', {
            name: "变化类型",
            slot: true,
            width:69
          });
        } else {
          delete thead.dv
          // this.$set(thead, 'ops', {
          //   name: '操作',
          //   slot: true
          // })
        }
        return thead;
      }
    },
    methods: {
      dvValue(val) {
        let data = {
          type: '',
          value: ''
        }
        if (val > 0) {
          data.value = '增加';
          data.type = 'success';
        } else if (val === 0) {
          data.value = '不变';
          data.type = 'info';
        } else {
          data.value = '减少';
          data.type = 'danger';
        }
        return data;
      },
      toFinish(scope) {
        if (scope.row['state'] === 'ready') {
          this.$emit('sub', scope);
        }
      },
      remove(scope) {
        this.$emit('remove', scope);
      },
      stateChange(val) {
        if (val) {
          this.$set(this.option, 'state', val);
        } else {
          this.$set(this.option, 'state', 'ready');
        }
      },
      dvChange(val) {
        if (val === 'jia') {
          this.$set(this.option, 'dv', {
            $gt: 0
          });
        } else if (val === 'bubian') {
          this.$set(this.option, 'dv', 0);
        } else {
          this.$set(this.option, 'dv', {
            $lt: 0
          });
        }
        // data.push(obj);
        // if (this.option.$or) {
        //   data.forEach(item => {
        //     this.option.$or.push(item);
        //   });
        // } else {
        //   this.$set(this.option, '$or', data);
        // }
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
      this.$set(this.option, 'populate', [{
        path: 'goods'
      }])
      this.changetype();
    }
  }
</script>

<style scoped>

</style>