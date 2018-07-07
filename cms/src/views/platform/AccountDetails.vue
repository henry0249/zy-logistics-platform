<template>
  <div style=" position: relative;">
    <div style="position: absolute;top:-205px; right:0;transform: translate(0,-50%);">
      <el-button size="mini" type="primary" plain @click="see(2)">扣款</el-button>
      <el-button size="mini" type="primary" plain @click="chongzhi">充值</el-button>
    </div>
    <div class="flex" style="width:100%;border:1px solid #ccc;">
      <p class="flex f1" style="justify-content: center;align-items: center;height:50px;border-right:1px solid #ccc;">公司名称</p>
      <p class="flex f1" style="justify-content: center;align-items: center;height:50px;border-right:1px solid #ccc;">对应金额</p>
      <div class="col-flex" style="flex:0 0 66.6%;justify-content: center;align-items: center;height:50px;">
        <div style="text-align: center;height:50%;width:100%;border-bottom:1px solid #ccc;box-sizing:border-box;">
          往来流水
        </div>
        <div class="flex" style="height:50%;width:100%;">
          <p class="felx f1" style=" text-align: center;justify-content: center;align-items: center;height:100%;border-right:1px solid #ccc;">日期</p>
          <p class="felx f1" style=" text-align: center;justify-content: center;align-items: center;height:100%;border-right:1px solid #ccc;">收款金额</p>
          <p class="felx f1" style=" text-align: center;justify-content: center;align-items: center;height:100%;border-right:1px solid #ccc;">支付金额</p>
          <p class="felx f1" style=" text-align: center;justify-content: center;align-items: center;height:100%;border-right:1px solid #ccc;">备注</p>
          <p class="felx" style="width:40px;text-align: center;justify-content: center;align-items: center;height:100%"></p>
        </div>
      </div>
    </div>
    <div class="flex" style="min-height:25px;width:100%;border:1px solid #ccc;border-top:none;">
      <p class="flex f1" style="justify-content: center;align-items: center;height:100px;border-right:1px solid #ccc;">测试公司</p>
      <p class="flex f1" style="justify-content: center;align-items: center;height:100px;border-right:1px solid #ccc;">￥12847750</p>
      <div class="flex f1" style="flex:0 0 66.6%;justify-content: center;align-items: center;height:100px;">
        <div class="col-flex f1" style="text-align: center;justify-content: center;align-items: center;height:100%;border-right:1px solid #ccc;">
          <div style="height:25px;border-bottom:1px solid #ccc;box-sizing:border-box;width:100%;" v-for="item in data.date" :key="item.id">{{item}}</div>
          <div style="width:100%;height:25px;">汇总</div>
        </div>
        <div class="col-flex f1" style="text-align: center;justify-content: center;align-items: center;height:100%;border-right:1px solid #ccc;">
          <div style="height:25px;border-bottom:1px solid #ccc;box-sizing:border-box;width:100%;" v-for="item in data.receivablesValue" :key="item.id">{{item}}</div>
          <div style="width:100%;height:25px;"></div>
        </div>
        <div class="col-flex f1" style="text-align: center;justify-content: center;align-items: center;height:100%;border-right:1px solid #ccc;">
          <div style="height:25px;border-bottom:1px solid #ccc;box-sizing:border-box;width:100%;" v-for="item in data.payValue" :key="item.id">{{item}}</div>
          <div style="width:100%;height:25px;"></div>
        </div>
        <div class="col-flex f1" style="text-align: center;justify-content: center;align-items: center;height:100%;">
          <div style="height:25px;border-bottom:1px solid #ccc;box-sizing:border-box;width:100%;border-right:1px solid #ccc;" v-for="item in data.base" :key="item.id">{{item}}</div>
          <div style="width:100%;height:25px;"></div>
        </div>
        <div class="col-flex" style="width:40px;text-align: center;justify-content: center;align-items: center;height:100%;">
          <div v-for="index in 3" :key="index" style="height:25px;border-bottom:1px solid #ccc;box-sizing:border-box;width:100%;" @click="see(index);">查看</div>
          <div style="width:100%;height:25px;"></div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogTableVisible">
      <account-dan :data="obj" :kaipiao="kaipiao"></account-dan>
    </el-dialog>
  </div>
</template>

<script>
  import AccountDan from './AccountDan.vue';
  export default {
    components: {
      AccountDan
    },
    props: {
      data: {
        type: Object,
        default () {
          return {
            name: 'A公司',
            value: 1000000,
            date: ['2018.01.01', '2018.01.02', '2018.01.03'],
            receivablesValue: ['', '', ''],
            payValue: ['', '', ''],
            base: ['', '', '']
          }
        }
      },
    },
    data() {
      return {
        kaipiao: false,
        dialogTableVisible: false,
        obj: {
          palyDate: '2018.01.01',
          id: '',
          title: '退款单',
          date: '2018.01.01',
          refunder: '用户1',
          receivabler: '用户2',
          zhanghu1: '',
          zhanghu2: '',
          zhanghao1: '',
          zhanghao: '',
          kaihuhang1: '',
          kaihuhang2: '',
          bigValue: '',
          value: '',
          base: '',
          address: '',
          mobile: '',
          type: '',
          taxrate: ''
        },
        thead: {
          name: {
            name: '公司名称',
            readOnly: true,
          }
        }
      }
    },
    methods: {
      chongzhi() {
        this.$set(this.obj, 'title', '充值单');
        this.kaipiao = false;
        this.dialogTableVisible = true
      },
      see(index) {
        console.log(index);
        if (index === 1) {
          this.$set(this.obj, 'title', '退款单');
          this.kaipiao = false;
        } else if (index === 2) {
          this.kaipiao = false;
          this.$set(this.obj, 'title', '扣款单');
        } else {
          this.$set(this.obj, 'title', '发票单');
          this.kaipiao = true;
        }
        this.dialogTableVisible = true
      }
    }
  }
</script>

<style scoped>
  .no-right {
    border-bottom: none;
  }
  .cline-any {}
</style>