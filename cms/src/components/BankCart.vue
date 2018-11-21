<template>
  <loading-box class="js" v-model="loadingText">
    <bank-cart-item :all-disabled="allDisabled" :isInvoice="isInvoice" ref="item1" class="f1" :data.sync="form" from key="1"></bank-cart-item>
    <div class="jc icon-right">
      <icon>icon-jiantou</icon>
      <icon>icon-jiantou</icon>
    </div>
    <bank-cart-item :all-disabled="allDisabled" :isInvoice="isInvoice" ref="item2" class="f1" :data.sync="form" to key="2"></bank-cart-item>
  </loading-box>
</template>

<script>
  export default {
    props: {
      data: {
        type: Object,
        default () {
          return [];
        }
      },
      initData: {
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
        loadingText: '',
        form: {}
      };
    },
    watch: {
      initData: {
        handler(val) {
          this.form = val;
        },
        deep: true
      },
      form: {
        handler(val) {
          let data = JSON.parse(JSON.stringify(val));
          if (!this.$refs.item1.CheckBankNo(data.from.account).isBank) {
            this.$set(data.from, 'account', '');
          }
          if (!this.$refs.item2.CheckBankNo(data.to.account).isBank) {
            this.$set(data.to, 'account', '');
          }
          this.$emit('update:data', data);
        },
        deep: true
      }
    },
    created() {
      this.form = JSON.parse(JSON.stringify(this.initData));
      console.log('object', this.initData);
    }
  };
</script>

<style scoped>
  .icon-right {
    padding: 0 20px;
  }
  span {
    font-size: 12px;
  }
</style>