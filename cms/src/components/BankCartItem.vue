<template>
  <loading-box v-model="loadingText">
    <el-card class="f1" v-bind="$attrs" :style="$attrs.cardStyle">
      <div slot="header">
        <slot name="header">
          <div class="jb">
            <div class="jc js">
              <common-select-by-code v-if="isFrom && !isInvoice && data.from.userType === 'company'" width="300px" :userType.sync="data.from.userType" :disabled="data.from.disabled" company check :data.sync="data.company" size="mini" placeholder="未选择" label="付款方"></common-select-by-code>
              <common-select-by-code v-if="isFrom && !isInvoice && data.from.userType === 'user'" width="300px" :userType.sync="data.from.userType" :disabled="data.from.disabled" user check :data.sync="data.user" size="mini" placeholder="未选择" label="付款方"></common-select-by-code>
              <common-select-by-code v-if="isFrom && !isInvoice && data.from.userType === 'mobile'" width="300px" :userType.sync="data.from.userType" :disabled="data.from.disabled" mobile check :data.sync="data.mobile" size="mini" placeholder="未注册公司或用户" label="付款方"></common-select-by-code>
              <common-select-by-code v-if="!isFrom && !isInvoice && data.to.userType === 'company'" width="300px" :userType.sync="data.to.userType" :disabled="data.to.disabled" company check :data.sync="data.toCompany" size="mini" placeholder="未选择" label="收款方"></common-select-by-code>
              <common-select-by-code v-if="!isFrom && !isInvoice && data.to.userType === 'user'" width="300px" :userType.sync="data.to.userType" :disabled="data.to.disabled" user check :data.sync="data.toUser" size="mini" placeholder="未选择" label="收款方"></common-select-by-code>
              <common-select-by-code v-if="!isFrom && !isInvoice && data.to.userType === 'mobile'" width="300px" :userType.sync="data.to.userType" :disabled="data.to.disabled" mobile check :data.sync="data.toMobile" size="mini" placeholder="未注册公司或用户" label="收款方"></common-select-by-code>
              <common-select-by-code v-if="isFrom && isInvoice && data.from.userType === 'company'" width="300px" :userType.sync="data.from.userType" :disabled="data.from.disabled" company check :data.sync="data.company" size="mini" placeholder="未选择" label="开票方"></common-select-by-code>
              <common-select-by-code v-if="isFrom && isInvoice && data.from.userType === 'user'" width="300px" :userType.sync="data.from.userType" :disabled="data.from.disabled" user check :data.sync="data.user" size="mini" placeholder="未选择" label="开票方"></common-select-by-code>
              <common-select-by-code v-if="isFrom && isInvoice && data.from.userType === 'mobile'" width="300px" :userType.sync="data.from.userType" :disabled="data.from.disabled" mobile check :data.sync="data.mobile" size="mini" placeholder="未注册公司或用户" label="开票方"></common-select-by-code>
              <common-select-by-code v-if="!isFrom && isInvoice && data.to.userType === 'company'" width="300px" :userType.sync="data.to.userType" :disabled="data.to.disabled" company check :data.sync="data.toCompany" size="mini" placeholder="未选择" label="收票方"></common-select-by-code>
              <common-select-by-code v-if="!isFrom && isInvoice && data.to.userType === 'user'" width="300px" :userType.sync="data.to.userType" :disabled="data.to.disabled" user check :data.sync="data.toUser" size="mini" placeholder="未选择" label="收票方"></common-select-by-code>
              <common-select-by-code v-if="!isFrom && isInvoice && data.to.userType === 'mobile'" width="300px" :userType.sync="data.to.userType" :disabled="data.to.disabled" mobile check :data.sync="data.toMobile" size="mini" placeholder="未注册公司或用户" label="收票方"></common-select-by-code>
            </div>
            <div class="jc js">
              <my-form-item number :controls="!numberDis" :disabled="numberDis" :min="0" width="200px" size="mini" label="金额" v-model.number="data.value"></my-form-item>
            </div>
          </div>
          <span v-if="isInvoice" class="danger" style="font-size:12px;margin:1px 0 1px 60px;"></span>
          <div class="jb" v-if="isInvoice">
            <div class="jc js">
              <my-form-item width="300px" :controls="taxRateControls" :disabled="taxRateDisabled" number :min="0" size="mini" v-model="data.taxRate" label="税率" placeholder="请输入税率"></my-form-item>
            </div>
            <div class="jc js">
              <my-form-item width="200px" :disabled="taxRateDisabled" select :options="field.Invoice.type.option" size="mini" v-model="data.type" label="发票类型" placeholder="请选择"></my-form-item>
            </div>
          </div>
          <span v-if="isInvoice" class="danger" style="font-size:12px;margin:1px 0 1px 60px;"></span>
          <div class="jb" v-if="isInvoice">
            <div class="jc js">
              <my-form-item width="300px" :disabled="taxRateDisabled" size="mini" v-model="data.from.name" label="开票名称" placeholder="请输入开票名称"></my-form-item>
            </div>
            <div class="jc js">
              <my-form-item width="200px" :disabled="taxRateDisabled" size="mini" v-model="data.contactNumber" label="联系电话" placeholder="请输入联系电话"></my-form-item>
            </div>
          </div>
          <span v-if="isInvoice" class="danger" style="font-size:12px;margin:1px 0 1px 60px;"></span>
          <div class="jb" v-if="isInvoice">
            <div class="jc js" style="width:100%;">
              <my-form-item width="100%" :disabled="taxRateDisabled" size="mini" v-model="data.address" label="地址" placeholder="请输入地址"></my-form-item>
            </div>
          </div>
          <span class="danger" style="font-size:12px;margin:1px 0 1px 60px;"></span>
          <div class="jb">
            <div class="jc js" style="width:100%;">
              <my-form-item :disabled="taxRateDisabled" size="mini" input type="textarea" autosize v-model="data.remark" placeholder="请输入备注" label="备注"></my-form-item>
            </div>
          </div>
        </slot>
      </div>
      <slot>
        <div class="jb" v-if="isInvoice">
          <my-form-item :disabled="allDisabled" v-if="isFrom" size="mini" v-model="data.from.taxNumber" label="纳税号" placeholder="请输入纳税号"></my-form-item>
          <my-form-item :disabled="allDisabled" v-else size="mini" v-model="data.to.taxNumber" label="纳税号" placeholder="请输入纳税号"></my-form-item>
        </div>
        <span v-if="isInvoice" class="danger" style="font-size:12px;margin:1px 0 1px 60px;"></span>
        <div class="jb">
          <my-form-item :disabled="allDisabled" v-if="isFrom" size="mini" v-model="data.from.account" label="账户" placeholder="请输入银行卡号"></my-form-item>
          <my-form-item :disabled="allDisabled" v-else size="mini" v-model="data.to.account" label="账户：" placeholder="请输入银行卡号"></my-form-item>
        </div>
        <span class="danger" style="font-size:12px;margin:1px 0 1px 60px;">{{check}}</span>
        <div class="jb">
          <my-form-item v-if="isFrom" :disabled="allDisabled" readonly size="mini" label="所属银行" v-model="data.from.bank" placeholder="请先输入银行卡号"></my-form-item>
          <my-form-item v-else readonly :disabled="allDisabled" size="mini" label="所属银行：" v-model="data.to.bank" placeholder="请先输入银行卡号"></my-form-item>
        </div>
        <span class="danger" style="font-size:12px;margin:1px 0 1px 60px;"></span>
        <div class="jb">
          <my-form-item :disabled="allDisabled" v-if="isFrom" size="mini" label="银行全称" v-model="data.from.bankName" placeholder="比如 中国建设银行(桂平支行)"></my-form-item>
          <my-form-item :disabled="allDisabled" v-else size="mini" label="银行全称：" v-model="data.to.bankName" placeholder="比如 中国建设银行(桂平支行)"></my-form-item>
        </div>
        <span class="danger" style="font-size:12px;margin:1px 0 1px 60px;"></span>
        <div class="jb">
          <my-form-item :disabled="allDisabled" v-if="isFrom && !isInvoice" size="mini" label="转账日期" date v-model="data.remittanceTime" type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </my-form-item>
          <my-form-item :disabled="allDisabled" v-if="!isFrom && !isInvoice" size="mini" label="到账日期" date v-model="data.accountingTime" type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </my-form-item>
          <my-form-item :disabled="allDisabled" v-if="isFrom && isInvoice" size="mini" label="开票日期" date v-model="data.billingDate" type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </my-form-item>
          <my-form-item disabled v-if="!isFrom && isInvoice" size="mini" label="录单日期" date v-model="data.createdAt" type="date" placeholder="选择日期" :picker-options="pickerOptions">
          </my-form-item>
        </div>
      </slot>
    </el-card>
  </loading-box>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return {};
        }
      },
      isInvoice: {
        type: Boolean,
        default: false
      },
      allDisabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        check: '',
        loadingText: '',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }
      }
    },
    watch: {
      testComputed(val) {},
      'data.from.account' (val) {
        if (val) {
          if (this.isFrom) {
            this.checkMethods(val);
          }
        }
      },
      'data.to.account' (val) {
        if (val) {
          if (!this.isFrom) {
            this.checkMethods(val);
          }
        }
      },
      allDisabled(val) {
        if (val) {
          this.$set(this.data.from, 'disabled', true);
          this.$set(this.data.to, 'disabled', true);
        }
      },
    },
    computed: {
      testComputed() {
        return this.allDisabled;
      },
      taxRateDisabled() {
        if (this.allDisabled) {
          return true;
        } else {
          return !this.isFrom;
        }
      },
      numberDis() {
        if (this.allDisabled) {
          return true;
        } else {
          if (this.isFrom) {
            return false;
          } else {
            return true;
          }
        }
      },
      taxRateControls() {
        return this.allDisabled || this.isFrom;
      },
      type() {
        for (const key in this.$attrs) {
          if (key === 'from') {
            return 'from'
          }
          if (key === 'to') {
            return 'to'
          }
        }
      },
      isFrom() {
        return this.type === 'from';
      }
    },
    methods: {
      async checkMethods(val) {
        this.check = '';
        let res = this.CheckBankNo(val);
        if (!res.isBank) {
          this.check = res.str;
          if (this.isFrom) {
            this.$set(this.data.from, 'bank', '');
          } else {
            this.$set(this.data.to, 'bank', '');
          }
        } else {
          let res = await this.getBank(val);
          if (res.validated) {
            if (this.isFrom) {
              this.$set(this.data.from, 'bank', res.bankName);
            } else {
              this.$set(this.data.to, 'bank', res.bankName);
            }
          }
        }
      },
      async getBank(val) {
        let res = {};
        try {
          this.loadingText = '加载中..';
          res = await this.$ajax.post('/bankcardinfo', {
            cardNo: val
          })
        } catch (error) {}
        this.loadingText = '';
        return res;
      },
      luhnCheck(bankno) {
        var lastNum = bankno.substr(bankno.length - 1, 1); //取出最后一位（与luhn进行比较）
        var first15Num = bankno.substr(0, bankno.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
          newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
          if ((j + 1) % 2 == 1) { //奇数位
            if (parseInt(newArr[j]) * 2 < 9)
              arrJiShu.push(parseInt(newArr[j]) * 2);
            else
              arrJiShu2.push(parseInt(newArr[j]) * 2);
          } else //偶数位
            arrOuShu.push(newArr[j]);
        }
        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
          jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
          jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }
        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
          sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }
        for (var n = 0; n < arrOuShu.length; n++) {
          sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }
        for (var p = 0; p < jishu_child1.length; p++) {
          sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
          sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
        //计算luhn值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhn = 10 - k;
        if (lastNum == luhn) {
          return true;
        } else {
          return false;
        }
      },
      //检查银行卡号
      CheckBankNo(bankno) {
        let str = '';
        let isBank = true;
        var bankno = bankno.replace(/\s/g, '');
        if (bankno == "") {
          str = '请填写银行卡号';
          return {
            str,
            isBank: false
          };
        }
        if (bankno.length < 16 || bankno.length > 19) {
          str = '银行卡号长度必须在16到19之间';
          return {
            str,
            isBank: false
          };
        }
        var num = /^\d*$/; //全数字
        if (!num.exec(bankno)) {
          str = '银行卡号必须全为数字';
          return {
            str,
            isBank: false
          };
        }
        //开头6位
        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
        if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
          str = '银行卡号开头6位不符合规范';
          return {
            str,
            isBank: false
          };
        }
        //Luhn校验
        if (!this.luhnCheck(bankno)) {
          return {
            str: '银行卡号必须符合luhn校验',
            isBank: false
          };
        }
        return {
          str: '',
          isBank: true
        }
      }
    },
    created() {}
  }
</script>

<style scoped>
  span {
    font-size: 12px;
  }
</style>