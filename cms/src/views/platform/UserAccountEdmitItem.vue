<template>
  <div style="width:100%;height:calc(100% - 53px);;">

  </div>
</template>

<script>
  import AccountItem from './AccountItem.vue';
  import AccountJournal from './AccountJournal.vue';
  export default {
    components: {
      AccountItem,
      AccountJournal
    },
    props: {
      accountValue:{
        type:Number,
        default:0
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
        input:0,
        account: {}
      }
    },
    watch: {
      account:{
        handler(val){
          console.log(val);
          this.$emit('update:accountObj',val);
        },
        deep:true
      }
    },
    methods: {
      res(){
        // this.$set(this.account,'value',this.input);
        this.dialogVisible = false;
        this.$emit('recharge',this.input)
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
.over{
  height: calc(100% - 55px);
  overflow: auto;
}
</style>