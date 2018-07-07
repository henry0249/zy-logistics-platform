<template>
  <div style="width:100%;height:calc(100% - 53px);;">
    <div class="flex" style="width:100%;height:50px;border:1px solid #ccc;">
      <p class="f1 js" style="height:100%;justify-content: center;align-items: center;border-right:1px solid #ccc;box-sizing:border-box;">
        资金余额
      </p>
      <p class="js" style="width:150px;height:100%;justify-content: center;align-items: center;border-right:1px solid #ccc;box-sizing:border-box;">
        未结算订单金额
      </p>
      <p class="js" style="width:200px;height:100%;justify-content: center;align-items: center;">
        已结算未开票金额
      </p>
    </div>
    <div class="flex" style="width:100%;height:100px;border:1px solid #ccc;border-top:none">
      <p class="f1 js" style="height:100%;justify-content: center;align-items: center;border-right:1px solid #ccc;box-sizing:border-box;">
        100000
      </p>
      <p class="js" style="width:150px;height:100%;justify-content: center;align-items: center;border-right:1px solid #ccc;box-sizing:border-box;">
        10000
      </p>
      <p class="js" style="width:200px;height:100%;justify-content: center;align-items: center;">
        10000
      </p>
    </div>
    <account-details style="margin-top:20px;"></account-details>
  </div>
</template>

<script>
  import AccountItem from './AccountItem.vue';
  import AccountJournal from './AccountJournal.vue';
  import AccountDetails from './AccountDetails.vue';
  export default {
    components: {
      AccountItem,
      AccountJournal,
      AccountDetails
    },
    props: {
      accountValue: {
        type: Number,
        default: 0
      },
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      accountObj: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        input: 0,
        account: {}
      }
    },
    watch: {
      account: {
        handler(val) {
          console.log(val);
          this.$emit('update:accountObj', val);
        },
        deep: true
      }
    },
    methods: {
      res() {
        // this.$set(this.account,'value',this.input);
        this.dialogVisible = false;
        this.$emit('recharge', this.input)
      },
      recharge() {
        this.$confirm('是否要给该用户充值？')
          .then(_ => {
            this.dialogVisible = true;
          })
          .catch(_ => {});
      }
    },
    created() {
      console.log(this.data.value);
      this.account = JSON.parse(JSON.stringify(this.data));
    }
  }
</script>

<style scoped>
  .over {
    height: calc(100% - 55px);
    overflow: auto;
  }
</style>