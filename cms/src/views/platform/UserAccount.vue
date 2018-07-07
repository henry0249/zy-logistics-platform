<template>
  <div>
    <div v-if="accountArr.length > 0">
      <my-table style="margin-top:20px;" border index size="mini" :thead="thead" edit :data.sync="accountArr" op>
        <div slot="op" slot-scope="scope">
          <i v-if="accountArr.length>1" title="删除该地区" class="pointer" style="margin-right:10px" @click="delAdr(scope['index'],accountArr)">
            <icon size="16px">icon-ec1</icon>
          </i>
          <i v-if="scope['index'] === accountArr.length - 1" title="增加一个地址" class="pointer" @click="addAdr(accountArr)">
            <icon size="16px">icon-54</icon>
          </i>
        </div>
      </my-table>
    </div>
    <div v-else class="jc">
      <p>该用户暂无账户余额，
        <el-button size="mini" type="primary" @click="addAccountArr">添 加</el-button>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
    },
    data() {
      return {
        accountArr: [],
        thead: {
          company: {
            name: '公司'
          },
          value: {
            name: '对应金额'
          },
          date: {
            name: '日期'
          },
          amountCollected: {
            name: '收款金额'
          },
          amountPay: {
            name: '支付金额'
          },
          remarks: {
            name: '备注'
          },
        }
      }
    },
    methods: {
      delAdr(i, arr) {
        if (arr.length > 1) {
          arr.splice(i, 1);
        } else {
          this.$alert(`至少有一个`, "提示", {
            confirmButtonText: "确定",
            callback: () => {
              return;
            }
          });
        }
      },
      addAdr(arr) {
        let obj = JSON.parse(JSON.stringify(arr[arr.length - 1]));
        obj.default = false
        arr.push(obj);
      },
      addAccountArr() {
        this.accountArr.push({
          value: 0,
        })
      }
    },
    created() {
      this.accountArr = JSON.parse(JSON.stringify(this.data))
    }
  }
</script>

<style scoped>

</style>