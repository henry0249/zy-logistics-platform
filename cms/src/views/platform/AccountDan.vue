<template>
  <div style="width:100%;border:1px solid #ccc;box-sizing:border-box;">
    <div class="jc" style="height:35px;width:100%;fontSize:18px;border-bottom:1px solid #ccc;box-sizing:border-box;">{{data.title}}</div>
    <div class="flex" style="height:30px;width:100%;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="f1 jc js" style="border-right:1px solid #ccc;height:30px;">{{dateTxt1}}</div>
        <div class="f1 jc" style="border-right:1px solid #ccc;height:30px;">{{data.date}}</div>
      </div>
      <div class="flex f1">
        <div class="f1 jc js" style="border-right:1px solid #ccc;height:30px;">录单日期</div>
        <div class="f1 jc" style="border-right:1px solid #ccc;height:30px;">{{data.date}}</div>
      </div>
      <div class="flex f1">
        <div class="f1 jc js" style="border-right:1px solid #ccc;height:30px;">单据编号</div>
        <div class="f1 jc" style="height:30px;">{{data.date}}</div>
      </div>
    </div>
    <div v-if="!kaipiao" class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">{{txt1}}</div>
        <div class="jc f1" style="width:60px;border-right:1px solid #ccc;">{{data.zhanghu1}}</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">{{txt2}}</div>
        <div class="jc" style="width:60px;">{{data.zhanghu2}}</div>
      </div>
    </div>
    <div v-else class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">开票方</div>
        <div class="jc f1" style="width:60px;border-right:1px solid #ccc;">{{data.zhanghu1}}</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">收票方</div>
        <div class="jc" style="width:60px;">{{data.zhanghu2}}</div>
      </div>
    </div>
    <div v-if="kaipiao" class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">开票名称</div>
        <div class="jc f1" style="width:60px;border-right:1px solid #ccc;">{{data.zhanghu1}}</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">收票名称</div>
        <div class="jc" style="width:60px;">{{data.zhanghu2}}</div>
      </div>
    </div>
    <div v-if="kaipiao" class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">纳税号</div>
        <div class="jc f1" style="width:60px;border-right:1px solid #ccc;">{{data.zhanghu1}}</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">纳税号</div>
        <div class="jc" style="width:60px;">{{data.zhanghu2}}</div>
      </div>
    </div>
    <div class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">账号</div>
        <div class="jc f1" style="width:60px;border-right:1px solid #ccc;">{{data.zhanghao1}}</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">账号</div>
        <div class="jc" style="width:60px;">{{data.zhanghao2}}</div>
      </div>
    </div>
    <div class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">开户行</div>
        <div class="jc f1" style="border-right:1px solid #ccc;">{{data.kaihuhang1}}</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">开户行</div>
        <div class="jc" style="">{{data.kaihuhang2}}</div>
      </div>
    </div>
    <div class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">地址</div>
        <div class="jc" style="">{{data.address}}</div>
      </div>
    </div>
    <div class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex" style="flex:0 0 50%;border-right:1px solid #ccc;width:60px;">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">电话</div>
        <div class="jc" style="">{{data.mobile}}</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">发票类型</div>
        <div class="jc" style="">{{data.type}}</div>
      </div>
      <div class="flex" style="flex:0 0 100px;">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">税率</div>
        <div class="jc" style="">{{data.taxrate}}</div>
      </div>
    </div>
    <div class="flex" style="flex-wrap: wrap;width:100%;height:30px;border-bottom:1px solid #ccc;box-sizing:border-box;">
      <div class="flex" style="flex:0 0 60%;border-right:1px solid #ccc;width:60px;">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">发票金额</div>
        <div class="jc" style="letter-spacing:6px;margin-left:5px;">仟 佰 拾 万 仟 佰 拾 元 角 分</div>
      </div>
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">小写</div>
        <div class="jc" style=""></div>
      </div>
    </div>
    <div class="flex" style="flex-wrap: wrap;width:100%;height:30px;">
      <div class="flex f1">
        <div class="jc" style="border-right:1px solid #ccc;width:60px;">备注</div>
        <div class="jc" style="">{{data.base}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      kaipiao: {
        type: Boolean,
        default: false
      },
      data: {
        type: Object,
        default () {
          return {
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
          }
        }
      },
    },
    data() {
      return {
        dateTxt1: '',
        dateTxt2: ''
      }
    },
    watch: {
      'data.title' (val) {
        console.log(val);
        if (val === '退款单') {
          this.dateTxt1 = '退款日期';
          this.txt1 = '退款方';
          this.txt2 = '收款方';
        } else if (val === '充值单') {
          this.dateTxt1 = '转账日期';
          this.txt1 = '付款方';
          this.txt2 = '收款方';
        } else if (val === '扣款单') {
          this.dateTxt1 = '扣款日期';
          this.txt1 = '扣款方';
          this.txt2 = '收款方';
        }
      }
    },
    created() {
      if (this.data.title === '退款单') {
        this.dateTxt1 = '退款日期';
        this.txt1 = '退款方';
        this.txt2 = '收款方';
      } else if (this.data.title === '充值单') {
        this.dateTxt1 = '转账日期';
        this.txt1 = '付款方';
        this.txt2 = '收款方';
      } else if (this.data.title === '扣款单') {
        this.dateTxt1 = '扣款日期';
        this.txt1 = '扣款方';
        this.txt2 = '收款方';
      }
    }
  }
</script>

<style scoped>
  .p {
    flex-wrap: wrap;
  }
</style>