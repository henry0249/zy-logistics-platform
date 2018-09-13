<template>
  <loading-box v-model="loadingText" style="padding:0 5%">
    <logistics-header :loadingText.sync="loadingText" :name.sync="name"></logistics-header>
    <logistics-table v-if="show" :companyId="name"></logistics-table>
  </loading-box>
</template>

<script>
  import LogisticsTable from './LogisticsTable.vue';
  import LogisticsHeader from './LogisticsHeader.vue';
  export default {
    components: {
      LogisticsTable,
      LogisticsHeader
    },
    data() {
      return {
        name: '',
        show: true,
        loadingText: ''
      }
    },
    watch: {
      name(val, old) {
        if (old) {
          this.show = false;
          this.$nextTick(() => {
            this.show = true;
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>