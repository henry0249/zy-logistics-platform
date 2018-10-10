<template>
  <loading-box v-model="loadingText">
    <div style="padding-bottom:1%">
      <div class="g-stock-info">
        <slot name="title">
          <div class="title">
            {{typeText}}单
          </div>
        </slot>
        <el-alert title="库存单类型" type="info" :closable="false"></el-alert>
        <div class="flex ac jb" style="margin-top:15px">
          <div class="pointer" v-for="(val,key) in field.Stock.type.option" :key="key" @click="changeKey(key)">
            <el-card :shadow="form.type === key?'always':'hover'" class="info" :class="{activeType:form.type === key}" style="padding:0 20px;font-size:13px">
              {{val}}单
            </el-card>
          </div>
        </div>
        <goods-list style="margin-top:15px;" :isCheck="isCheck" :type="form.type" :addCheck.sync="addCheck" :data.sync="goodsData"></goods-list>
        <el-alert style="margin-top:15px" title="库存单信息" type="info" :closable="false">
        </el-alert>
        <my-form size="small" width="49%">
          <div class="flex ac jb" style="margin-top:15px">
            <my-form-item label="名称" v-model="form.name"></my-form-item>
            <my-form-item label="状态" v-model="form.state" select :options="field.Stock.state.option"></my-form-item>
          </div>
          <my-form-item style="margin-top:15px" width="100%" label="备注" v-model="form.remark"></my-form-item>
        </my-form>
        <el-alert style="margin-top:15px" title="待处理状态的库存单不会使库存立即变化,完成状态会立即修改库存" type="warning" :closable="false" center show-icon>
        </el-alert>
        <el-alert v-if="$route.query._id" style="margin:15px 0 15px 0;" title="运单信息" type="info" :closable="false"></el-alert>
        <stock-logistics v-if="$route.query._id && val.businessTrains" :logisticsTrajectory="logisticsTrajectory" :val="val.businessTrains.logistics || []"></stock-logistics>
        <span v-if="$route.query._id && !val.businessTrains" class="jc" style="color:#909399;font-size:13px">暂无数据</span>
        <el-alert v-if="$route.query._id" style="margin:15px 0 15px 0;" title="物流信息" type="info" :closable="false"></el-alert>
        <Stock-logistics-trajectory v-if="$route.query._id && val.businessTrains" :logistics="val.businessTrains.logistics || []" :logisticsTrajectory="logisticsTrajectory"></Stock-logistics-trajectory>
        <div  v-if="$route.query._id && !val.businessTrains" class="jc" style="color:#909399;font-size:13px">暂无数据</div>
      </div>
      <div class="flex ac jb" style="margin-top:30px">
        <slot name="left">
          <el-button size="small" @click="back()">返回</el-button>
          <el-button size="small" @click="del()">删除该数据</el-button>
        </slot>
        <div class="f1"></div>
        <slot name="right">
          <el-button :disabled="subDisabled" type="primary" size="small" @click="submit">{{submitText}}</el-button>
        </slot>
      </div>
    </div>
  </loading-box>
</template>

<script>
  import GoodsList from './GoodsList.vue';
  import StockLogistics from './StockLogistics.vue';
  import StockLogisticsTrajectory from './StockLogisticsTrajectory.vue';
  export default {
    components: {
      GoodsList,
      StockLogistics,
      StockLogisticsTrajectory
    },
    props: {
      goodsId: {
        type: String,
        default: ''
      },
      val: {
        type: Object,
        default () {
          return {};
        }
      },
      logisticsTrajectory: {
        type: Array,
        default () {
          return [];
        }
      },
      submitText: {
        type: String,
        default: "确认提交"
      }
    },
    data() {
      return {
        checkAll: false,
        addCheck: false,
        subDisabled: false,
        goodsData: [],
        goodsObj: {},
        loadingText: "",
        form: {
          state: "finish",
          type: "in",
          name: "",
          remark: ""
        },
      };
    },
    watch: {
      val: {
        handler(val) {
          let io = false;
          if (val.businessTrains) {
            if (val.businessTrains.logistics) {
              val.businessTrains.logistics.forEach(item => {
                if (item.state !== 5) {
                  io = true;
                }
              });
            }
          }else{
            io = true;
          }
          this.subDisabled = io;
        },
        deep: true
      },
      goodsData: {
        handler(val) {},
        deep: true
      },
      company: {
        handler(val) {
          this.$emit('update:goodsId', '');
        },
        deep: true
      },
      form: {
        handler: function(val) {
          this.$emit("update:data", val);
        },
        deep: true
      },
      "form.type" (val) {
        this.setName();
      },
      "form.name" (val) {
        if (this.val.name) {
          this.$set(this.form, 'name', this.val.name);
        }
      }
    },
    computed: {
      isCheck() {
        return this.form.type === 'check';
      },
      typeText() {
        return this.field.Stock.type.option[this.form.type] || "未知类型";
      },
    },
    methods: {
      add() {
        this.addCheck = true;
      },
      async del() {
        if (this.$route.query._id) {
          try {
            this.loadingText = '删除中';
            let del = await this.$ajax.post('/stock/delete', {
              _id: this.$route.query._id
            });
          } catch (error) {}
          this.loadingText = '';
          this.$router.push({
            path: '/stock/home'
          });
        }
      },
      checkAllGoods() {
        this.checkAll = true;
      },
      changeKey(key) {
        this.form.type = key
      },
      setName() {
        let date = this.formatTime(new Date(), "YYYY年MM月DD日A");
        date = date.replace("AM", "上午");
        date = date.replace("PM", "下午");
        if (Object.keys(this.goodsObj).length > 0) {
          this.form.name = `${date}${this.goodsObj.name}的${this.typeText}单`;
        } else {
          this.form.name = `${date}的${this.typeText}单`;
        }
      },
      submit() {
        if (this.checkMethods()) {
          let data = [];
          this.form.company = this.company._id;
          this.goodsData.forEach(item => {
            let obj = JSON.parse(JSON.stringify(this.form));
            this.$set(obj, 'goods', item._id);
            this.$set(obj, 'num', item.key);
            data.push(obj);
          });
          this.$emit("submit", data);
        }
      },
      checkMethods() {
        let check = true;
        if (this.goodsData.length === 0) {
          this.$message.warn('必须选择商品');
          check = false;
        }
        this.goodsData.forEach(item => {
          if (!item._id) {
            this.$message.warn('必须选择商品');
            check = false;
          }
          if (!item.key) {
            this.$message.warn(`${this.field.Stock.type.option[this.form.type]}数量必须大于0`);
            check = false;
          }
        });
        return check;
      }
    },
    mounted() {
      if (this.val && this.val._id) {
        this.form = JSON.parse(JSON.stringify(this.val));
      } else {
        if (!this.form.name) {
          this.setName();
        }
        if (this.$route.query.type && this.field.Stock.type.option[this.$route.query.type]) {
          this.form.type = this.$route.query.type
        }
      }
    },
    created() {
      console.log(this.val);
      if (this.val && this.val._id) {
        let obj = this.val.goods;
        if (this.val.num) {
          this.$set(obj, 'key', this.val.num);
        }
        this.goodsData.push(obj);
      }
      if (this.$route.query._id) {
        this.subDisabled = true;
      }
    }
  };
</script>

<style scoped>
  .g-stock-info {
    padding: 30px;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .title {
    font-size: 20px;
    text-align: center;
    padding-bottom: 15px;
  }
  .activeType {
    color: #aaa;
    background-color: #409eff;
    color: #fff;
    font-weight: 500;
  }
</style>