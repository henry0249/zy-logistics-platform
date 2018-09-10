<template>
  <loading-box v-model="loadingText">
    <div class="g-order-create">
      <div class="g-order">
        <div class="flex ac jc" style="font-size:22px;padding-bottom:20px">
          <strong>{{stockTitle}}</strong>
        </div>
        <common-alert style="margin:15px 0">库存详情</common-alert>
        <my-form size="mini" width="24%" style="margin:15px 0" v-if="!loadingText">
          <div class="jb">
            <my-form-item v-if="sys" :disabled="data.type?true:false" select v-model="data.type" label="库存变化类型" :options="field.Stock.type.option"></my-form-item>
            <my-form-item placeholder="请输入库存单名称" input v-model="data.name" filterable label="库存单名称"></my-form-item>
            <my-form-item number v-model="data.num" filterable label="数量" :min="0" :max="maxStock"></my-form-item>
            <div v-if="sys" style="width:24%">
              <my-select :disabled="!sys" label="所属公司" :data.sync="data.company" company></my-select>
            </div>
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
          company: {}
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
        this.$set(this.data, 'type', val);
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
          return '添加入库';
        } else if (this.type === 'out') {
          return '添加出库';
        } else if (this.type === 'increase') {
          return '添加增益';
        } else if (this.type === 'decrease') {
          return '添加损耗';
        }
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
            let res = await this.$api.curd(data);
            this.$message.success('添加成功！');
            this.$emit('sub', '1111111');
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
      }
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