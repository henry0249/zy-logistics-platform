<template>
  <div>
    <add-header :title="title" @add="add"></add-header>
    <div class="p-list">
    </div>
  </div>
</template>

<script>
  import AddHeader from '../common/AddHeader';
  export default {
    components: {
      AddHeader,
    },
    data() {
      return {
        title: '平台添加',
        dialogVisible: false,
        keyArr: []
      }
    },
    methods: {
      async add() {
        let query = {}
        query.title = this.title
        query.key = 'company'
        query.str = 'platform'
        console.log(query);
        this.$router.push({
          path: '/organizationa/add',
          query
        })
      }
    },
  }
</script>

<style scoped>

</style>