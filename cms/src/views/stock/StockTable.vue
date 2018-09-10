<template>
  <common-table v-if="show" height="calc(100vh - 50px)" style="padding:0" path="stock/find" :option="option" :thead="thead" op>
    <div slot="header">
      <my-form-item width='300px' label="变化类型" @change="typeChange" style="padding-right:10px;" size="mini" multiple collapse-tags v-model="typeData" :options="field.Stock.type.option" select></my-form-item>
    </div>
    <template slot-scope="scope">
      <div v-if="scope.prop === 'type'">{{field.Stock.type.option[scope.row['type']]}}</div>
      <div v-if="scope.prop === 'createdAt'">{{changeDate(scope.row['createdAt'])}}</div>
      <div v-if="scope.prop === 'state'">{{field.Stock.state.option[scope.row['state']]}}</div>
      <div v-if="scope.prop === 'op'" @click="toFinish(scope)">标记成已完成</div>
    </template>
  </common-table>
</template>

<script>
  export default {
    data() {
      return {
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
    watch: {
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
      toFinish(scope){},
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
        if (this.$attrs.state) {
          
        }
        if (!this.$attrs.state) {
          delete this.option.state;
        } else {
          this.$set(this.option, 'state', this.$attrs.state);
        }
        this.$set(this.option, 'sort', {
          createdAt: -1
        });
        this.$set(this.option, 'company', this.company._id);
        if (this.$attrs.state === 'ready') {
          this.$set(this.thead,'op',{
            name:'操作',
            slot:true
          })
        }
      }
    },
    created() {
      this.changetype();
    }
  }
</script>

<style scoped>

</style>