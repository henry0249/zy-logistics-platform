<template>
  <div>
    <bank-cart :allDisabled="boo" :isInvoice="isInvoice" :data.sync="newData" :initData="initData" style="width:100%">
    </bank-cart>
  </div>
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
      initData: {
        type: Object,
        default () {
          return {};
        }
      },
    },
    data() {
      return {
        newData: {},
        boo: false
      }
    },
    watch: {
      newData: {
        handler(val) {
          this.$emit('update:data', val);
        },
        deep: true
      }
    },
    computed: {
      isInvoice() {
        return this.$route.query.titleType === 'isInvoice';
      },
    },
    created() {
      if (this.$route.params._id) {
        if (this.$route.query.payName === 'invoice' || this.$route.query.payName === 'received') {
          this.boo = false;
        } else {
          this.boo = true;
        }
      } else {
        this.boo = false;
      }
    }
  }
</script>

<style scoped>

</style>