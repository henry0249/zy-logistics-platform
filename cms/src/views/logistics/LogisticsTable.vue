<template>
  <loading-box v-model="loadingText">
    <common-table style="padding:0" path="/logistics/find" :thead="thead" :option="option">
      <div slot="header" class="jc js">
        <my-form-item size="mini" @change="inputChange" input v-model="input" label="单号" width="200px" style="margin-right:20px;"></my-form-item>
        <my-form-item clearable size="mini" @change="stateChange" select v-model="state" label="状态" :options="field.Logistics.state.option" width="200px"></my-form-item>
      </div>
      <template slot-scope="scope">
        <div v-if="scope.prop === 'no'" class="link" @click="goEdmit(scope)">{{scope.row['no']}}</div>
        <div v-if="scope.prop === 'state'">{{field.Logistics.state.option[scope.row['state']]}}</div>
        <div v-if="scope.prop === 'startAt'">{{scope.row['startAt']?changeDate(scope.row['startAt']):'暂未开车'}}</div>
        <div v-if="scope.prop === 'finishAt'">{{scope.row['finishAt']?changeDate(scope.row['finishAt']):'暂未到达'}}</div>
      </template>
    </common-table>
  </loading-box>
</template>

<script>
  export default {
    props: {
      companyId: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        state:'',
        input: '',
        loadingText: '',
        option: {
          populate: [{
            path: 'area',
            populate: [{
              path: 'county'
            }, {
              path: 'city'
            }, {
              path: 'province'
            }]
          }]
        },
        thead: {
          no: {
            name: '单号',
            slot: true
          },
          state: {
            name: '状态',
            slot: true
          },
          areaInfo: {
            name: '地址',
          },
          startAt: {
            name: '出发时间',
            slot: true
          },
          finishAt: {
            name: '送达时间',
            slot: true
          }
        }
      }
    },
    watch: {
      companyId(val) {
        this.$set(this.option, 'handle', val);
      },
      'option.handle'(val){
        if (val === 0 || val === '0') {
          delete this.option.handle;
        }
      }
    },
    methods: {
      stateChange(val){
        console.log(val);
        if (val || val === 0) {
          this.$set(this.option,'state',val);
        }else {
          delete this.option.state;
        }
      },
      inputChange(val) {
        if (val) {
          this.$set(this.option, '$or', [{
            no: {
              $regex: val
            }
          }])
        }else {
          delete this.option.$or;
        }
      },
      goEdmit(val) {
        console.log(val.row._id);
        this.$router.push({
          path: '/logistics/edit/' + val.row._id,
        });
      },
      setArea(val) {
        console.log(val);
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
      async getCount() {
        try {
          let res = await this.$api.curd({
            model: 'logistics',
            curdType: 'count',
            state: {
              $nin: [5]
            },
            handle: this.companyId
          })
          // this.$emit('update:count',)
        } catch (error) {}
      }
    },
    created() {
      if (this.companyId) {
        this.$set(this.option, 'handle', this.companyId);
      }
    }
  }
</script>

<style scoped>

</style>