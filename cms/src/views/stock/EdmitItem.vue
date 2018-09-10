<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{field.Stock.type.option[type]}}单</strong>
        </div>
        <common-alert style="margin:15px 0">库存详情</common-alert>
        <my-form size="mini" :width="widthStyle" style="margin:15px 0" v-if="!loadingText">
          <div class="jb">
            <my-form-item v-if="sys" select v-model="data.type" label="库存变化类型" :options="field.Stock.type.option"></my-form-item>
            <my-form-item placeholder="请输入库存单名称" clearable input v-model="data.name" filterable label="库存单名称"></my-form-item>
            <my-form-item number v-model="data.num" filterable label="数量" :min="0" :max="maxStock"></my-form-item>
            <my-form-item v-if="!isFinish" select v-model="data.state" label="状态" :options="field.Stock.state.option"></my-form-item>
          </div>
        </my-form>
      </div>
      <div class="tr jb" style="margin-top:30px">
        <el-button size="small" @click="back">返 回</el-button>
        <el-button size="small" type="primary" @click="sub">添 加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      isFinish: {
        type: Boolean,
        default: true
      },
      sys: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ""
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        stock: {},
        stockIsEmpty: false,
        loadingText: '',
        data: {
          name: '',
          type: '',
          num: 0,
          company: {},
          state: 'ready'
        }
      }
    },
    watch: {
      async 'data.type' (val) {
        await this.getStock();
        if (Object.keys(this.stock).length > 0 || this.stock) {
          this.stockIsEmpty = false;
        } else {
          this.stockIsEmpty = true;
        }
        this.$set(this.data, 'name', this.changeDate(new Date()) + ' ' + this.field.Stock.type.option[this.type]);
      },
      company: {
        handler(val) {
          if (!this.sys) {
            this.$set(this.data, 'company', val);
          }
        },
        deep: true
      }
    },
    computed: {
      stockTitle() {
        if (this.type === 'in') {
          return '入库单';
        } else if (this.type === 'out') {
          return '添加出库';
        } else if (this.type === 'increase') {
          return '添加增益';
        } else if (this.type === 'decrease') {
          return '添加损耗';
        }
      },
      widthStyle() {
        if (this.isFinish) {
          return '48%';
        }
        return '32%';
      },
      maxStock() {
        let data = 0
        if (this.data.type === 'out' || this.data.type === 'decrease') {
          data = this.stock.new;
        } else {
          data = undefined;
        }
        return data;
      }
    },
    methods: {
      back() {
        this.$emit('back', false);
      },
      checkMethods() {
        let io = true
        if (!this.data.type) {
          this.$message.warn('库存变化类型是必选的');
          io = false;
          return
        }
        if (this.data.num === 0) {
          this.$message.warn('库存数量必须大于0');
          io = false;
          return
        }
        if (!this.data.company) {
          this.$message.warn('所属公司是必填的');
          io = false;
          return
        }
        return io;
      },
      async sub() {
        try {
          this.loadingText = '添加中';
          if (this.checkMethods()) {
            let data = {
              model: 'stock',
              curdType: 'set',
            }
            for (const key in this.data) {
              if (key === 'company') {
                this.$set(data, key, this.data[key]._id);
              } else {
                this.$set(data, key, this.data[key]);
              }
            }
            if (this.isFinish) {
              this.$set(data, 'state', 'finish');
            } else {
              this.$set(data, 'state', 'ready');
            }
            if (!data.name) {
              this.$set(data, 'name', this.changeDate(new Date()) + '的' + this.field.Stock.type.option[this.type] + '单');
            }
            let res = await this.$api.curd(data);
            this.$message.success('添加成功！');
            this.$emit('sub');
          }
        } catch (error) {}
        this.loadingText = '';
      },
      async getStock() {
        try {
          this.loadingText = '加载中';
          let data = {
            model: 'stock',
            curdType: 'findOne',
            sort: {
              createdAt: -1
            },
          }
          this.stock = await this.$api.curd(data);
        } catch (error) {}
        this.loadingText = '';
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
    },
    async created() {
      try {
        this.loadingText = '加载中';
        if (this.type) {
          this.$set(this.data, 'type', this.type);
        }
      } catch (error) {}
      if (!this.sys) {
        this.$set(this.data, 'company', this.company);
      }
      this.$set(this.data, 'name', this.changeDate(new Date()) + '的' + this.field.Stock.type.option[this.type] + '单');
      this.loadingText = '';
    }
  };
</script>

<style scoped>
  .g-order-create {
    padding: 3% 5%;
  }
  .g-order {
    margin: 0 auto;
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style>