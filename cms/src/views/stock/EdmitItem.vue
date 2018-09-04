<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{type === 'add'?'添加库存':'修改库存'}}</strong>
        </div>
        <common-alert style="margin:15px 0">库存详情</common-alert>
        <my-form size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
          <div class="jb">
            <my-form-item select v-model="data.type" @change="change" label="库存变化类型" :options="field.Stock.type.option"></my-form-item>
            <my-form-item placeholder="请输入库存单名称" input v-model="data.name" filterable label="库存单名称"></my-form-item>
            <my-form-item number v-model="data.num" filterable label="数量" :min="0"></my-form-item>
            <div style="width:24%">
              <my-select :disabled="!sys" label="所属公司" :data.sync="data.company" company></my-select>
            </div>
          </div>
        </my-form>
      </div>
      <div class="tr" style="margin-top:30px">
        <el-button size="small" @click="$router.go(-1)">返 回</el-button>
        <el-button size="small" type="primary" @click="sub">添 加</el-button>
      </div>
    </div>
  </loading-box>
</template>

<script>
  export default {
    props: {
      sys: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: "add"
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
          company: {}
        }
      }
    },
    watch: {
      company: {
        handler(val) {
          if (!this.sys) {
            this.$set(this.data, 'company', val);
          }
        },
        deep: true
      }
    },
    methods: {
      async change(val) {
        await this.getStock();
        console.log(this.stock);
        if (Object.keys(this.stock).length > 0 || this.stock) {
          this.stockIsEmpty = false;
        } else {
          this.stockIsEmpty = true;
        }
        console.log(this.stockIsEmpty);
      },
      checkMethods() {
        let io = true
        if (!this.data.name) {
          this.$message.warn('库存单名称是必填的');
          io = false;
          return
        }
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
          this.loadingText = `${this.type === 'add'?'添加中':'修改中'}`;
          if (this.checkMethods()) {
            if (this.type === 'add') {
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
              if (this.stockIsEmpty) {
                this.$set(data, 'new', this.data.num);
                this.$set(data, 'old', 0);
                this.$set(data, 'dv', this.data.num);
              } else {
                if (this.data.type === 'in' || this.data.type === 'increase') {
                  this.$set(data, 'new', this.stock.new + this.data.num);
                } else if (this.data.type === 'out' || this.data.type === 'decrease') {
                  this.$set(data, 'new', this.stock.new - this.data.num);
                }
                this.$set(data, 'old', this.stock.new);
                this.$set(data, 'dv', data.new - data.old);
              }
              let res = await this.$api.curd(data);
            }
          }
        } catch (error) {
          console.log(error);
        }
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
            type: this.data.type
          }
          this.stock = await this.$api.curd(data);
        } catch (error) {}
        this.loadingText = '';
      }
    },
    async created() {
      try {
        this.loadingText = '加载中';
      } catch (error) {}
      if (!this.sys) {
        this.$set(this.data, 'company', this.company);
      }
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